const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const loginAuth = require("../middleware/auth/loginAuth");
const validate = require("../module/validation");
const { NOTICE_POST_IMG_TB } = require("../module/constraint");
const { CLUB } = require("../module/global");
const { NOTICE } = require("../module/global")
const { BadRequestException } = require("../module/customError");
const res = require("express/lib/response");

// 동아리 공지 게시물 불러오는 api
router.get("/list/club/:clubId", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    };
    const { clubId } = req.params;
    const page = Number(req.query.page || 1);

    try {
        validate(clubId, "clubId").checkInput().isNumber();
        validate(page, 'page').isNumber().isPositive();

        const offset = (page - 1) * CLUB.MAX_POST_COUNT_PER_PAGE;
        const selectNoticeAllCountSql = `SELECT
                                                count(*)::int
                                          FROM
                                                notice_post_tb`;

        const selectNoticePostSql = `SELECT 
                                            notice_post_tb.id,
                                            notice_post_tb.title, 
                                            notice_post_tb.content, 
                                            notice_post_tb.is_fixed AS "isFixed", 
                                            TO_CHAR(notice_post_tb.created_at, 'YYYY-MM-DD') AS "createdAt", 
                                            account_tb.name AS "authorName",
                                            account_tb.personal_color AS "authorPcolor"
                                     FROM 
                                            notice_post_tb
                                     JOIN 
                                            account_tb ON notice_post_tb.account_id = account_tb.id
                                     WHERE 
                                            club_id = $1
                                     ORDER BY 
                                            notice_post_tb.created_at DESC 
                                     OFFSET 
                                            $2
                                     LIMIT 
                                            $3`;
        const selectNoticePostParam = [clubId, offset, CLUB.MAX_POST_COUNT_PER_PAGE];
        const noticeAllCountData = await pool.query(selectNoticeAllCountSql);
        const noticePostData = await pool.query(selectNoticePostSql, selectNoticePostParam);
        if (noticePostData.rowCount === 0) {
            throw new BadRequestException("해당하는 동아리에 공지글이 존재하지 않습니다");
        }

        result.data = {
            count: noticeAllCountData.rows[0].count,
            notice: noticePostData.rows
        }

    } catch (error) {
        return next(error);
    }

    res.send(result);
});

// 고정 공지 게시물 불러오는 api
router.get("/fixed/club/:clubId", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    }
    const { clubId } = req.params;

    try {
        const selectedFixedNoticeSql = `SELECT
                                                notice_post_tb.id,
                                                notice_post_tb.title,
                                                notice_post_tb.created_at AS "createdAt",
                                                account_tb.personal_color AS "authorPcolor",
                                                account_tb.name AS "authorName"
                                        FROM 
                                                notice_post_tb
                                        JOIN
                                                account_tb ON notice_post_tb.account_id = account_tb.id
                                        WHERE
                                                is_fixed = true
                                        AND
                                                club_id = $1
                                        LIMIT
                                                $2`;
        const selectedFixedNoticeParam = [clubId, CLUB.MAX_FIXED_NOTICE_COUNT_PER_PAGE];

        const data = await pool.query(selectedFixedNoticeSql, selectedFixedNoticeParam);
        if (data.rowCount !== 0) {
            throw new BadRequestException("고정 공지 게시글이 존재하지 않습니다");
        }

        result.data = {
            notice: data.rows
        }

    } catch (error) {
        return next(error);
    }

    res.send(result);
});

// 공지 게시물 작성
router.post("/", loginAuth, async (req, res, next) => {
    const { clubId, title, content, images, isFixed } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(clubId,"clubId").checkInput().isNumber()
        validate(title, "title").checkInput().checkLength(1,NOTICE.MAX_TITLE_LENGTH)
        validate(content, "content").checkInput().checkLength(1,NOTICE.MAX_CONTENT_LENGTH)
        validate(isFixed, "isFixed").checkInput().isBoolean()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 작성 권한 체크 (해당 동아리 운영진)
        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE club_id = $1 AND account_id = $2`
        const selectPositionParams = [ clubId, userId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)

        if (selectPositionResult.rowCount == 0) throw new BadRequestException("해당 동아리 부원이 아닙니다")
        if (selectPositionResult.rows[0] >= 2) throw new BadRequestException("공지 게시물을 작성할 권한이 없습니다")

        // 공지 게시물 작성
        const postNoticeSql = `INSERT INTO notice_post_tb (account_id, club_id, title, content, is_fixed) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id AS "postId"`

        const postNoticeParams = [ userId, clubId, title, content, isFixed ]
        const postNoticeResult = await pgClient.query(postNoticeSql, postNoticeParams)
        const postId = postNoticeResult.rows[0].postId

        // 이미지 저장
        const postNoticeImgSql = `INSERT INTO notice_post_img_tb (post_id, post_img) 
            VALUES ($1, UNNEST($2::VARCHAR[]))`
        const postNoticeImgParams = [ postId, images ]
        await pgClient.query(postNoticeImgSql, postNoticeImgParams)
        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
        res.send(result)
    }
})

// 공지 게시물 수정
router.put("/", loginAuth, async (req, res, next) => {
    const { noticeId, title, content, images, isFixed } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(noticeId, "noticeId").checkInput().isNumber()
        validate(title, "title").checkInput().checkLength(1,NOTICE.MAX_TITLE_LENGTH)
        validate(content, "content").checkInput().checkLength(1,NOTICE.MAX_CONTENT_LENGTH)
        validate(isFixed, "isFixed").checkInput().isBoolean()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 수정 권한 체크 (해당 동아리 운영진)
        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE account_id = $1
            AND club_id = (
                SELECT notice_post_tb.club_id
                FROM notice_post_tb
                WHERE notice_post_tb.id = $2 
            )`
        const selectPositionParams = [ userId, noticeId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)

        if (selectPositionResult.rowCount == 0) throw new BadRequestException("해당 동아리 부원이 아닙니다")
        if (selectPositionResult.rows[0] >= 2) throw new BadRequestException("공지 게시물을 수정할 권한이 없습니다")

        // 공지 게시물 수정
        const putNoticeSql = `UPDATE notice_post_tb 
            SET title = $1, content = $2, is_fixed = $3 
            WHERE id = $4`
        const putNoticeParams = [ title, content, isFixed, noticeId ]
        const putNoticeResult = await pgClient.query(putNoticeSql, putNoticeParams)
        if (putNoticeResult.rowCount == 0) throw new BadRequestException("일치하는 공지 게시물이 없습니다")

        // 이미지 삭제
        const deleteNoticeImgSql = `DELETE FROM notice_post_img_tb
            WHERE post_id = $1`
        const deleteNoticeImgParams = [noticeId]
        await pgClient.query(deleteNoticeImgSql, deleteNoticeImgParams)

        // 이미지 저장
        const insertNoticeImgSql = `INSERT INTO notice_post_img_tb (post_id, post_img) 
            VALUES ($1,UNNEST($2::VARCHAR[]))`
        const insertNoticeImgParams = [noticeId, images]
        await pgClient.query(insertNoticeImgSql, insertNoticeImgParams)

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
        res.send(result)
    }
})

// 공지 게시물 삭제
router.delete("/", loginAuth, async (req, res, next) => {
    const { noticeId } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(noticeId, "noticeId").checkInput().isNumber()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 삭제 권한 체크
        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE account_id = $1
            AND club_id = (
                SELECT notice_post_tb.club_id
                FROM notice_post_tb
                WHERE notice_post_tb.id = $2 
            )`
        const selectPositionParams = [ userId, noticeId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)

        if (selectPositionResult.rowCount == 0) throw new BadRequestException("해당 동아리 부원이 아닙니다")
        if (selectPositionResult.rows[0] >= 2) throw new BadRequestException("공지 게시물을 삭제할 권한이 없습니다")

        // 공지 게시물 삭제
        const deleteNoticeSql = `DELETE FROM notice_post_tb 
            WHERE id = $2`
        const deleteNoticeParams = [ noticeId ]
        const deleteNoticeResult = await pool.query(deleteNoticeSql, deleteNoticeParams)

        if (deleteNoticeResult == 0) throw new BadRequestException("일치하는 공지 게시물이 없습니다")

        // 이미지 삭제
        const deleteNoticeImgSql = `DELETE FROM notice_post_img_tb
            WHERE post_id = $1`
        const deleteNoticeImgParams = [ noticeId ]
        await pgClient.query(deleteNoticeImgSql, deleteNoticeImgParams)

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
        res.send(result)
    }
})

// 공지 게시물 조회
router.get("/:noticeId", loginAuth, async (req, res, next) => {
    const { noticeId } = req.params
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        pgClient = await pool.connect()
        await pgClient.query("BEGIN")
        const selectNoticeSql = `SELECT notice_post_tb.id AS "noticeId",
                account_tb.id AS "authorId",
                account_tb.name AS "authorName",
                account_tb.personal_color AS "authorPersonalColor",
                ARRAY_AGG(notice_post_img_tb.post_img) AS "postImages",
                notice_post_tb.title AS "title",
                notice_post_tb.content AS "content",
                TO_CHAR(notice_post_tb.created_at, 'yyyy.mm.dd') AS "createdAt"
            FROM notice_post_tb
            JOIN account_tb ON notice_post_tb.account_id = account_tb.id
            JOIN notice_post_img_tb ON notice_post_tb.id = notice_post_img_tb.post_id
            WHERE notice_post_tb.id = $1
            GROUP BY "noticeId",
            "authorId",
            "authorName",
            "authorPersonalColor",
            "title",
            "content",
            "createdAt"`
        const selectNoticeParams = [noticeId]
        const selectNoticeResult = await pgClient.query(selectNoticeSql,selectNoticeParams)

        result.data = selectNoticeResult.rows[0]

        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE account_id = $1
            AND club_id = (
                SELECT notice_post_tb.club_id
                FROM notice_post_tb
                WHERE notice_post_tb.id = $2 
            )`
        const selectPositionParams = [ userId, noticeId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)

        result.data.managerState = ( selectNoticeResult.rows[0] >= 2 ? false : true )

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
        res.send(result)
    }
})


// 공지 게시물 댓글 작성

router.post("/comment", loginAuth, async (req, res, next) => {
    const { noticeId, content } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }


    let pgClient = null


    try {
        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE account_id = $1
            AND club_id = (
                SELECT notice_post_tb.club_id
                FROM notice_post_tb
                WHERE notice_post_tb.id = $2 
            )`
        const selectPositionParams = [ userId, noticeId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)
        
        if (selectPositionResult.rowCount == 0) throw new BadRequestException ("해당 동아리의 부원이 아닙니다")

        const insertCommentsql = `INSERT INTO notice_comment_tb (account_id, notice_post_id, content) 
            VALUES ($1, $2, $3)`
        const insertCommentparams = [ userId, noticeId, content ]
        await pgClient.query(insertCommentsql, insertCommentparams)

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
        res.send(result)
    }
})

module.exports = router
