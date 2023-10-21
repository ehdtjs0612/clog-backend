const router = require("express").Router();
const loginAuth = require('../../middleware/auth/loginAuth');
const validate = require('../../module/validation');
const { REPLY } = require("../../module/global")

// // 게시글의 답글 리스트 조회
// // 권한: 로그인한 유저
router.get("/list/comment/:commentId", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id;
    const { commentId } = req.params;
    const page = req.query.page || 1;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(commentId, "comment-id").checkInput().isNumber();
        const offset = (page - 1) * REPLY.MAX_REPLY_COUNT_PER_COMMENT;

        const selectReplySql = `SELECT
                                    notice_reply_tb.id,
                                    notice_reply_tb.content,
                                    TO_CHAR(notice_reply_tb.created_at, 'yyyy.mm.dd') AS "createdAt",
                                    notice_reply_tb.account_id AS "authorId",
                                    account_tb.entry_year AS "entryYear",
                                    account_tb.name AS "authorName",
                                    major_tb.name AS "authorMajor"
                                    account_tb.personal_color AS "authorPcolor",
                                    COALESCE(
                                        (
                                            SELECT
                                                club_member_tb.position < 2 OR notice_reply_tb.account_id = $1
                                            FROM
                                                club_member_tb
                                            WHERE
                                                club_member_tb.account_id = $1
                                            AND
                                                club_member_tb.club_id = club_tb.id
                                        )
                                    , false) AS "manageState"
                                FROM
                                    notice_reply_tb
                                JOIN
                                    account_tb
                                ON
                                    notice_reply_tb.account_id = account_tb.id
                                JOIN
                                    major_tb
                                ON
                                    account_tb.major = major_tb.id
                                JOIN
                                    notice_comment_tb
                                ON
                                    notice_reply_tb.comment_id = notice_comment_tb.id
                                JOIN
                                    notice_post_tb
                                ON
                                    notice_comment_tb.post_id = notice_post_tb.id
                                JOIN
                                    club_tb
                                ON
                                    notice_post_tb.club_id = club_tb.id
                                WHERE
                                    notice_reply_tb.comment_id = $2`;
        const selectReplyParam = [userId, commentId];
        const selectReplyData = await pool.query(selectReplySql, selectReplyParam);
        result.data = {
            replys: selectReplyData.rows
        }
    } catch (error) {
        return next(error);
    }
    res.send(result);
});

module.exports = router;
