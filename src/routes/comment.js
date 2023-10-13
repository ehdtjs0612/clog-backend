const router = require("express").Router();
const pool = require('../../config/database/postgresql');
const loginAuth = require('../middleware/auth/loginAuth');
const validate = require('../module/validation');
const { COMMENT } = require('../module/global');
const CONSTRAINT = require("../module/constraint");
const { BadRequestException } = require('../module/customError');

// 게시글의 댓글 리스트 조회 api
router.get("/list/post/:postId", loginAuth, async (req, res, next) => {
});

// 댓글 작성 api
// 권한: 해당 동아리에 가입되어있어야 함.
router.post("/", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id;
    const { postId, content } = req.body;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(postId, "postId").checkInput().isNumber();
        validate(content, "content").checkInput().checkLength(1, COMMENT.MAX_COMMENT_CONTENT_LENGTH);
        const selectClubAuthSql = `SELECT 
                                        (
                                            SELECT 
                                                club_member_tb.id 
                                            FROM 
                                                club_member_tb 
                                            WHERE 
                                                club_member_tb.club_id = club_tb.id
                                            AND 
                                                club_member_tb.account_id = $1 
                                        ) AS "accountId" 
                                    FROM 
                                        club_post_tb 
                                    JOIN 
                                        club_board_tb 
                                    ON 
                                        club_post_tb.club_board_id = club_board_tb.id 
                                    JOIN 
                                        club_tb 
                                    ON 
                                        club_board_tb.club_id = club_tb.id 
                                    WHERE 
                                        club_post_tb.id = $2`;
        const selectClubAuthParam = [userId, postId];
        const selectClubAuthData = await pool.query(selectClubAuthSql, selectClubAuthParam);
        if (selectClubAuthData.rowCount === 0) {
            throw new BadRequestException("해당하는 게시글이 존재하지 않습니다");
        }
        if (!selectClubAuthData.rows[0].accountId) {
            throw new BadRequestException("동아리에 가입하지 않은 사용자입니다");
        }
        result.data = selectClubAuthData.rows;

        const insertCommentSql = `INSERT INTO
                                            club_comment_tb (account_id, club_post_id, content)
                                        VALUES
                                            ($1, $2, $3)
                                        RETURNING
                                            id`;
        const insertCommentParam = [userId, postId, content];
        const insertCommentData = await pool.query(insertCommentSql, insertCommentParam);
        result.data = {
            commentId: insertCommentData.rows[0].id
        }
    } catch (error) {
        if (error.constraint === CONSTRAINT.FK_CLUB_POST_TO_COMMENT_TB) {
            return next(new BadRequestException("해당하는 게시글이 존재하지 않습니다"));
        }
        return next(error);
    }
    res.send(result);
});

// 댓글 수정 api
router.put("/", loginAuth, async (req, res, next) => {

});

// 댓글 삭제 api
router.delete("/", loginAuth, async (req, res, next) => {

});

module.exports = router;
