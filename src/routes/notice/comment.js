const router = require("express").Router()
const pool = require("../../../config/database/postgresql")
const loginAuth = require("../../middleware/auth/loginAuth")
const validate = require("../../module/validation")
const { NOTICE, NOTICE_COMMENT } = require("../../module/global")
const { BadRequestException } = require("../../module/customError")

// 공지 게시물 댓글 작성
router.post("/", loginAuth, async (req, res, next) => {
    const { noticeId, content } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(noticeId, "noticeId").checkInput().isNumber()
        validate(content, "content").checkInput().checkLength(1,NOTICE.MAX_COMMENT_CONTENT_LENGTH)

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 작성 권한 체크
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

        // 공지 댓글 작성
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
    }
    res.send(result)
})

// 공지 게시물 댓글 수정
router.put("/", loginAuth, async (req, res, next) => {
    const { commentId, content } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(commentId, "commentId").checkInput().isNumber()
        validate(content, "content").checkInput().checkLength(1,NOTICE.MAX_COMMENT_CONTENT_LENGTH)

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 공지 답글 수정
        const updateCommentSql = `UPDATE notice_comment_tb
            SET content = $1
            WHERE notice_comment_tb.id = $2 AND notice_comment_tb.account_id = $3`
        const updateCommentParams = [content, commentId, userId]
        const updateCommentResult = await pgClient.query(updateCommentSql,updateCommentParams)
        
        // 댓글이 없거나, 내가 작성한 댓글이 아닌 경우
        if (updateCommentResult.rowCount == 0) throw new BadRequestException ("수정 가능한 댓글이 없습니다")

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})

// 공지 게시물 댓글 삭제
router.delete("/", loginAuth, async (req, res, next) => {
    const { commentId } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(commentId, "commentId").checkInput().isNumber()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 공지 댓글 삭제
        const deleteCommentSql = `DELETE FROM notice_comment_tb
            WHERE notice_comment_tb.id = $1 AND notice_comment_tb.account_id = $2`
        const deleteCommentParams = [commentId, userId]
        const deleteCommentResult = await pgClient.query(deleteCommentSql,deleteCommentParams)

        // 댓글이 없거나 내가 작성한 댓글이 아닌 경우
        if (deleteCommentResult.rowCount == 0) throw new BadRequestException("삭제 가능한 댓글이 없습니다")

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})

// 공지 게시물 댓글 리스트 조회
router.get("/:noticeId/list", loginAuth, async (req, res, next) => {
    const { noticeId } = req.params
    const { page } = req.query
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(noticeId,"noticeId").checkInput().isNumber()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 댓글 목록 조회
        const selectCommentListSql = `SELECT notice_comment_tb.id AS "id",
            notice_comment_tb.content AS "content",
            TO_CHAR(notice_comment_tb.created_at, 'YYYY-MM-DD') AS "createdAt",
            notice_comment_tb.account_id AS "authorId",
            account_tb.name AS "authorName",
            account_tb.personal_color AS "authorPersonalColor",
            (
                SELECT COUNT (1)
                FILTER (WHERE notice_reply_tb.notice_comment_id = notice_comment_tb.id)
                FROM notice_reply_tb
            ) AS "replyCount"
            FROM notice_comment_tb
            JOIN account_tb ON notice_comment_tb.account_id = account_tb.id
            WHERE notice_comment_tb.notice_post_id = $1
            ORDER BY "createdAt" DESC
            LIMIT $2
            OFFSET $3`
        const selectCommentListParams = [noticeId, NOTICE_COMMENT.MAX_COMMENT_COUNT_PER_POST, NOTICE_COMMENT.MAX_COMMENT_COUNT_PER_POST * (page - 1)]
        const selectCommentResult = await pgClient.query(selectCommentListSql,selectCommentListParams)
        
        // 각 댓글이 작성자인지 체크
        const selectCommentData = selectCommentResult.rows
        selectCommentData.forEach( elem => elem.authorState = (elem.authorId == userId ? true : false))
        
        result.data = selectCommentData

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})

module.exports = router