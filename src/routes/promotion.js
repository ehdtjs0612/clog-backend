const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const loginAuth = require('../middleware/auth/loginAuth');
const validate = require('../module/validation');
const { BadRequestException } = require("../module/customError");

// 동아리 내 홍보 게시물 조회
// 권한: 로그인한 사용자라면 다 가능
router.get("/:promotionId", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id;
    const { promotionId } = req.params;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(promotionId, "promotion-id").checkInput().isNumber();

        const selectPromotionSql = `SELECT 
                                        club_tb.name AS "clubName", 
                                        club_tb.profile_img AS "profileImage", 
                                        promotion_tb.title, 
                                        promotion_tb.content,
                                        ARRAY (
                                            SELECT
                                                promotion_img_tb.post_img
                                            FROM
                                                promotion_img_tb
                                            WHERE
                                                promotion_img_tb.post_id = $1
                                        ) AS "promotionImage",
                                        TO_CHAR(
                                            promotion_tb.created_at, 'YYYY.mm.dd'
                                        ) AS "createdAt",
                                        COALESCE(
                                        (
                                            SELECT
                                                club_member_tb.position < 2
                                            FROM
                                                club_member_tb
                                            WHERE
                                                club_member_tb.club_id = club_tb.id
                                            AND
                                                club_member_tb.account_id = $2
                                        ), false) AS "adminState"
                                    FROM
                                        promotion_tb
                                    JOIN
                                        club_tb
                                    ON
                                        promotion_tb.club_id = club_tb.id
                                    WHERE
                                        promotion_tb.id = $3`;
        const selectPromotionParam = [promotionId, userId, promotionId];
        const selectPromotionData = await pool.query(selectPromotionSql, selectPromotionParam);
        if (selectPromotionData.rowCount === 0) {
            throw new BadRequestException("해당하는 홍보물이 존재하지 않습니다");
        }
        result.data = {
            promotion: selectPromotionData.rows[0]
        }

    } catch (error) {
        return next(error);
    }
    res.send(result);
});

module.exports = router;
