const router = require("express").Router()
const pool = require("../../../config/database/postgresql")
const loginAuth = require("../../middleware/auth/loginAuth")
const validate = require("../../module/validation")
const { NOTICE_REPLY, POSITION } = require("../../module/global")
const { BadRequestException } = require("../../module/customError")

// 공지 답글 작성
router.post("/", loginAuth, async (req, res, next) => {
    const { commentId, content } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        validate(commentId, "commentId").checkInput().isNumber()
        validate(content, "content").checkInput().checkLength(1,NOTICE_REPLY.MAX_REPLY_CONTENT_LENGTH)

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 작성 권한 체크 (해당 동아리의 부원인지)
        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE account_id = $1
            AND club_id = (
                SELECT notice_post_tb.club_id
                FROM notice_comment_tb
                JOIN notice_post_tb
                ON notice_comment_tb.notice_post_id = notice_post_tb.id
                WHERE notice_comment_tb.id = $2 
            )`
        const selectPositionParams = [ userId, commentId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)
        
        if (selectPositionResult.rowCount == 0) throw new BadRequestException ("해당 동아리의 부원이 아닙니다")

        // 공지 답글 작성
        const insertReplySql = `INSERT INTO notice_reply_tb (account_id, notice_comment_id, content)
            VALUES ($1, $2, $3)`
        const insertReplyParams = [userId, commentId, content]
        await pgClient.query(insertReplySql,insertReplyParams)

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        return next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})

// 공지 답글 수정
router.put("/", loginAuth, async (req, res, next) => {
    const { replyId, content } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        validate(replyId, "replyId").checkInput().isNumber()
        validate(content, "content").checkInput().checkLength(1,NOTICE_REPLY.MAX_REPLY_CONTENT_LENGTH)

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

       // 수정 권한 체크
       const selectPositionSql = `SELECT 
            notice_reply_tb.account_id AS "authorId",
                (
                    SELECT club_member_tb.position
                    FROM club_member_tb
                    WHERE club_member_tb.club_id = notice_post_tb.club_id
                    AND club_member_tb.account_id = $1
                ) AS "position"
            FROM notice_reply_tb
            JOIN notice_comment_tb
            ON notice_reply_tb.notice_comment_id = notice_comment_tb.id
            JOIN notice_post_tb 
            ON notice_comment_tb.notice_post_id = notice_post_tb.id
            WHERE notice_reply_tb.id = $2`
        const selectPositionParams = [userId, replyId]
        const selectPositionResult = await pgClient.query(selectPositionSql,selectPositionParams)
        console.log(userId)
        console.log(selectPositionResult.rows)

        if (selectPositionResult.rowCount == 0) {
        throw new BadRequestException("답글이 존재하지 않습니다")
        }

        if (selectPositionResult.rows[0].position == null) {
        throw new BadRequestException("해당 동아리의 부원이 아닙니다")
        }

        if (selectPositionResult.rows[0].position > POSITION.MANAGER && selectPositionResult.rows[0].authorId != userId){
        throw new BadRequestException("답글을 수정할 권한이 없습니다")
        }

        // 공지 답글 수정
        const updateReplySql = `UPDATE notice_reply_tb
            SET content = $1
            WHERE notice_reply_tb.id = $2`
        const updateReplyParams = [content, replyId]
        await pgClient.query(updateReplySql,updateReplyParams)

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        return next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})

// 공지 답글 삭제
router.delete("/", loginAuth, async (req, res, next) => {
    const { replyId } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        validate(replyId, "replyId").checkInput().isNumber()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

       // 삭제 권한 체크
       const selectPositionSql = `SELECT 
            notice_reply_tb.account_id AS "authorId",
                (
                    SELECT club_member_tb.position
                    FROM club_member_tb
                    WHERE club_member_tb.club_id = notice_post_tb.club_id
                    AND club_member_tb.account_id = $1
                ) AS "position"
            FROM notice_reply_tb
            JOIN notice_comment_tb
            ON notice_reply_tb.notice_comment_id = notice_comment_tb.id
            JOIN notice_post_tb 
            ON notice_comment_tb.notice_post_id = notice_post_tb.id
            WHERE notice_reply_tb.id = $2`
        const selectPositionParams = [userId, replyId]
        const selectPositionResult = await pgClient.query(selectPositionSql,selectPositionParams)

        if (selectPositionResult.rowCount == 0) {
        throw new BadRequestException("답글이 존재하지 않습니다")
        }

        if (selectPositionResult.rows[0].position == null) {
        throw new BadRequestException("해당 동아리의 부원이 아닙니다")
        }

        if (selectPositionResult.rows[0].position > POSITION.MANAGER && selectPositionResult.rows[0].authorId != userId){
        throw new BadRequestException("답글을 삭제할 권한이 없습니다")
        }

        // 공지 답글 삭제
        const deleteReplySql = `DELETE FROM notice_reply_tb
            WHERE notice_reply_tb.id = $1`
        const deleteReplyParams = [replyId]
        await pgClient.query(deleteReplySql,deleteReplyParams)

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        return next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})

// 공지 답글 목록 조회
router.get("/:commentId/list", loginAuth, async (req, res, next) => {
    const { commentId } = req.params
    const { page } = req.query
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        validate(commentId,"commentId").checkInput().isNumber()
        validate(page,"page").checkInput().isNumber()

        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        // 조회 권한 체크 (해당 동아리의 부원인지)
        const selectPositionSql = `SELECT position
            FROM club_member_tb
            WHERE account_id = $1
            AND club_id = (
                SELECT notice_post_tb.club_id
                FROM notice_comment_tb
                JOIN notice_post_tb
                ON notice_comment_tb.notice_post_id = notice_post_tb.id
                WHERE notice_comment_tb.id = $2 
            )`
        const selectPositionParams = [ userId, commentId ]
        const selectPositionResult = await pgClient.query(selectPositionSql, selectPositionParams)
        
        if (selectPositionResult.rowCount == 0) throw new BadRequestException ("해당 동아리의 부원이 아닙니다")

        // 답글 목록 조회
        const selectCommentListSql = `SELECT notice_reply_tb.id AS "id",
                notice_comment_tb.content AS "content",
                TO_CHAR(notice_comment_tb.created_at, 'YYYY-MM-DD') AS "createdAt",
                notice_comment_tb.account_id AS "authorId",
                account_tb.name AS "authorName",
                account_tb.personal_color AS "authorPersonalColor",
                COALESCE(
                    (
                        SELECT club_member_tb.position < 2
                        FROM club_member_tb
                        WHERE club_member_tb.club_id = club_tb.id
                        AND club_member_tb.account_id = $1
                    ), false
                ) AS "manageState"
            FROM notice_reply_tb
            JOIN notice_comment_tb ON notice_reply_tb.notice_comment_id = notice_comment_tb.id
            JOIN account_tb ON notice_comment_tb.account_id = account_tb.id
            JOIN notice_post_tb ON notice_comment_tb.notice_post_id = notice_post_tb.id
            JOIN club_tb ON notice_post_tb.club_id = club_tb.id
            WHERE notice_reply_tb.notice_comment_id = $2
            ORDER BY "createdAt" DESC
            LIMIT $3
            OFFSET $4`
        const selectCommentListParams = [userId, commentId, NOTICE_REPLY.MAX_REPLY_COUNT_PER_COMMENT, NOTICE_REPLY.MAX_REPLY_COUNT_PER_COMMENT * (page - 1)]
        const selectCommentListResult = await pgClient.query(selectCommentListSql,selectCommentListParams)

        console.log(selectCommentListResult.rows)
        result.data = {
            replies : selectCommentListResult.rows
        }

        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        return next(error)
    } finally {
        if (pgClient) pgClient.release
    }
    res.send(result)
})
module.exports = router