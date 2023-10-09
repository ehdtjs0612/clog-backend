const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const loginAuth = require("../middleware/auth/loginAuth");
const managerAuth = require("../middleware/auth/managerAuth");
const validate = require("../module/validation");
const { NOTICE_POST_IMG_TB } = require("../module/constraint");
const { CLUB } = require("../module/global");
const { NOTICE } = require("../module/global")
const { BadRequestException } = require("../module/customError");

// 동아리 공지 게시물 불러오는 api
router.get("/list/club/:clubId", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    };
    const { clubId } = req.params;
    let page = req.query.page ?? 1;
    if (page < 1) page = 1;

    try {
        validate(clubId, "clubId").checkInput().isNumber();
        validate(page, "page").isNumber().checkLength(1, 5);

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
        if (noticePostData.rowCount !== 0) {
            result.data = {
                count: noticeAllCountData.rows[0].count,
                notice: noticePostData.rows
            }
            return res.send(result);
        }
        throw new BadRequestException("해당하는 동아리에 공지글이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
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
            result.data = {
                notice: data.rows
            }
            return res.send(result);
        }
        throw new BadRequestException("고정 공지 게시글이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

// 공지 게시물 작성
router.post("/", loginAuth, managerAuth, async (req, res, next) => {
    const { clubId, title, content, images, isFixed } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(clubId,"clubId").checkInput().isNumber()
        validate(title, "title").checkInput().checkLength(1,NOTICE.MAX_TITLE_LENGTH)
        validate(content, "content").checkInput().checkLength(1,NOTICE.MAX_CONTENT_LENGTH)
        validate(isFixed, "isFixed").checkInput().isBoolean()

        const postNoticeSql = `INSERT INTO notice_post_tb (account_id, club_id, title, content, is_fixed) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id AS "postId"`
        const postNoticeParams = [ userId, clubId, title, content, isFixed ]
        const postNoticeResult = await pool.query(postNoticeSql, postNoticeParams)
        const postId = postNoticeResult.rows[0].postId

        const postNoticeImgSql = `INSERT INTO notice_post_img_tb (post_id, post_img) 
            VALUES ($1, $2)`
        const postNoticeImgParams = [ postId, images ]
        const data = await pool.query(postNoticeImgSql, postNoticeImgParams)

        result.message = "공지 게시물 작성 성공"

        res.send(result)
    } catch (error) {
        next(error)
        if (error.constraint === NOTICE_POST_IMG_TB.FK_POST_ID) {
            return next(new BadRequestException("존재하지 않는 게시글 입니다"))
        }
    }
})


// 공지 게시물 수정
router.put("/", loginAuth, managerAuth, async (req, res, next) => {
    const { noticeId, clubId, title, content, images, isFixed } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(clubId, "clubId").checkInput().isNumber()
        validate(noticeId, "noticeId").checkInput().isNumber()
        validate(title, "title").checkInput().checkLength(1,NOTICE.MAX_TITLE_LENGTH)
        validate(content, "content").checkInput().checkLength(1,NOTICE.MAX_CONTENT_LENGTH)
        validate(isFixed, "isFixed").checkInput().isBoolean()

        const putNoticeSql = `UPDATE notice_post_tb 
            SET title = $1, content = $2, is_fixed = $3 
            WHERE account_id = $4 AND id = $5`
        const putNoticeParams = [ title, content, isFixed, userId, noticeId ]
        const putNoticeResult = await pool.query(putNoticeSql, putNoticeParams)
        if (putNoticeResult == 0) throw new BadRequestException("일치하는 공지 게시물이 없습니다")

        const putNoticeImgSql = `UPDATE notice_post_img_tb AS img
            SET post_img = $1 
            FROM notice_post_tb AS post
            WHERE img.post_id = post.id AND post.id = $2 AND post.account_id = $3
            RETURNING post.id AS "post_id"`
        const putNoticeImgParams = [ images, noticeId, userId ]
        const putNoticeImgResult = await pool.query(putNoticeImgSql, putNoticeImgParams)
        if (putNoticeImgResult == 0) throw new BadRequestException("일치하는 공지 게시물 이미지가 없습니다")

        result.message = "공지 게시물 수정 성공"
        res.send(result)
    } catch (error) {
        next(error)
    }
})

module.exports = router;
