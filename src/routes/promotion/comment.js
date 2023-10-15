const router = require("express").Router();
const pool = require("../../../config/database/postgresql");
const loginAuth = require("../../middleware/auth/loginAuth");
const validate = require("../../module/validation");
const { PROMOTION_COMMENT } = require("../../module/global");
const { BadRequestException } = require('../../module/customError');
const CONSTRAINT = require("../../module/constraint");

// 홍보 게시물에 댓글 작성 api
// 권한: 로그인한 유저라면 전부 다
router.post("/", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id;
    const { promotionId, content } = req.body;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(promotionId, "promotionId").checkInput().isNumber();
        validate(content, "content").checkInput().checkLength(1, PROMOTION_COMMENT.MAX_COMMENT_CONTENT_LENGTH);

        const insertCommentSql = `INSERT INTO
                                            promotion_comment_tb(account_id, post_id, content)
                                        VALUES
                                            ($1, $2, $3)
                                        RETURNING
                                            id`;
        const insertCommentParam = [userId, promotionId, content];
        const insertCommentData = await pool.query(insertCommentSql, insertCommentParam);
        result.data = {
            commentId: insertCommentData.rows[0]
        };

    } catch (error) {
        if (error.constraint === CONSTRAINT.FK_ACCOUNT_TO_PROMOTION_COMMENT_TB) {
            return next(new BadRequestException("해당하는 사용자가 존재하지 않습니다"));
        }
        if (error.constraint === CONSTRAINT.FK_PROMOTION_TO_PROMOTION_COMMENT_TB) {
            return next(new BadRequestException("해당하는 홍보글이 존재하지 않습니다"));
        }
        return next(error);
    }
    res.send(result);
});

module.exports = router;
