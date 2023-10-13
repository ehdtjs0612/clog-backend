const router = require("express").Router();
const pool = require('../../config/database/postgresql');
const loginAuth = require('../middleware/auth/loginAuth');
const { BadRequestException } = require('../module/customError');
const { REPLY } = require('../module/global');
const validate = require('../module/validation');

// 댓글의 답글 리스트를 조회
// 권한: 해당 동아리에 가입되어있어야 함
router.get("/list/comment/:commentId", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id;
    const { commentId } = req.params;
    const page = req.query.page || 1;
    const result = {
        message: "",
        data: {}
    };
    const offset = (page - 1) * REPLY.MAX_REPLY_COUNT_PER_COMMENT;

    try {
        validate(commentId, "commentId").checkInput().isNumber();
        validate(page, "page").isNumber().isPositive();

        const selectClubAuthSql = `SELECT
                                        club_comment_tb.account_id AS "accountId",
                                        (
                                            SELECT
                                                club_member_tb.position
                                            FROM
                                                club_member_tb
                                            WHERE
                                                club_member_tb.club_id = club_tb.id
                                            AND
                                                club_member_tb.account_id = $1
                                        ) AS "position"
                                    FROM
                                        club_comment_tb
                                    JOIN
                                        club_post_tb
                                    ON
                                        club_comment_tb.club_post_id = club_post_tb.id
                                    JOIN
                                        club_board_tb
                                    ON
                                        club_post_tb.club_board_id = club_board_tb.id
                                    JOIN
                                        club_tb
                                    ON
                                        club_board_tb.club_id = club_tb.id
                                    WHERE
                                        club_comment_tb.id = $2`;
        const selectClubAuthParam = [userId, commentId];
        const selectClubAuthResult = await pool.query(selectClubAuthSql, selectClubAuthParam);
        if (selectClubAuthResult.rowCount === 0) {
            throw new BadRequestException("댓글이 존재하지 않습니다");
        }
        if (selectClubAuthResult.rows[0].position === null) {
            throw new BadRequestException("해당 동아리에 가입되어있지 않습니다");
        }
        const selectReplySql = `SELECT
                                    club_reply_tb.id,
                                    club_reply_tb.content,
                                    club_reply_tb.created_at AS "createdAt",
                                    account_tb.id AS "accountId",
                                    account_tb.entry_year AS "entryYear",
                                    account_tb.name AS "authorName",
                                    (
                                        SELECT
                                            position_tb.name
                                        FROM
                                            club_member_tb
                                        JOIN
                                            position_tb
                                        ON
                                            club_member_tb.position = position_tb.id
                                        WHERE
                                            club_member_tb.account_id = account_tb.id
                                        AND
                                            club_member_tb.club_id = club_tb.id
                                    ) AS "authorPosition",
                                    (
                                        SELECT
                                            major_tb.name
                                        FROM
                                            club_member_tb
                                        JOIN
                                            major_tb
                                        ON
                                            account_tb.major = major_tb.id
                                        WHERE
                                            club_member_tb.account_id = account_tb.id
                                        AND
                                            club_member_tb.club_id = club_tb.id
                                    ) AS "authorMajor",
                                    account_tb.personal_color AS "authorPcolor",
                                    account_tb.id = $1 AS "authorState"
                                FROM
                                    club_reply_tb
                                JOIN
                                    account_tb
                                ON
                                    club_reply_tb.account_id = account_tb.id
                                JOIN
                                    club_comment_tb
                                ON
                                    club_reply_tb.club_comment_id = club_comment_tb.id
                                JOIN
                                    club_post_tb
                                ON
                                    club_comment_tb.club_post_id = club_post_tb.id
                                JOIN
                                    club_board_tb
                                ON
                                    club_post_tb.club_board_id = club_board_tb.id
                                JOIN
                                    club_tb
                                ON
                                    club_board_tb.club_id = club_tb.id
                                WHERE
                                    club_reply_tb.club_comment_id = $2
                                ORDER BY
                                    club_reply_tb.created_at ASC
                                OFFSET
                                    $3
                                LIMIT
                                    $4`;
        const selectReplyParam = [userId, commentId, offset, REPLY.MAX_REPLY_COUNT_PER_COMMENT];
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
