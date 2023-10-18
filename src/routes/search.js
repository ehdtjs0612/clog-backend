const router = require("express").Router();
const pool = require('../../config/database/postgresql');
const loginAuth = require('../middleware/auth/loginAuth');
const validate = require('../module/validation');
const { SEARCH } = require("../module/global");

// 동아리 검색 api (대분류, 소분류 기준)
router.get("/category/list", loginAuth, async (req, res, next) => {
    const { "big-category": bigCategory, "small-category": smallCategory } = req.query;
    const userId = req.decoded.id;
    const page = req.query.page || 1;
    const offset = (page - 1) * SEARCH.MAX_CLUB_PER_PAGE;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(bigCategory, "big-category");
        validate(smallCategory, "small-category");
        validate(page, "page");

        let selectClubSql = `SELECT
                                    club_tb.id,
                                    club_tb.profile_img AS "profileImg",
                                    club_tb.name,
                                    club_tb.cover,
                                    COALESCE(
                                        (
                                        SELECT
                                            club_member_tb.account_id = $1
                                        FROM
                                            club_member_tb
                                        WHERE
                                            club_member_tb.account_id = $1
                                        AND
                                            club_member_tb.club_id = club_tb.id
                                    ), FALSE) AS "isMember",
                                    club_tb.is_recruit AS "isRecruit"
                                FROM 
                                    club_tb
                                WHERE `;
        let selectClubParam = [userId];
        if (bigCategory && smallCategory) {
            // 1. 대분류와 소분류 둘 다 있는 경우
            selectClubSql += `big_category = $2 AND small_category = $3 ORDER BY club_tb.created_at DESC OFFSET $4 LIMIT $5`;
            selectClubParam.push(bigCategory, smallCategory, offset, SEARCH.MAX_CLUB_PER_PAGE);
        } else if (bigCategory && !smallCategory) {
            // 2. 대분류만 있고 소분류가 없는 경우
            selectClubSql += ` big_category = $2 ORDER BY club_tb.created_at DESC OFFSET $3 LIMIT $4`;
            selectClubParam.push(bigCategory, offset, SEARCH.MAX_CLUB_PER_PAGE);
        } else if (!bigCategory && smallCategory) {
            // 3. 대분류는 없고 소분류만 있는 경우
            selectClubSql += ` small_category = $2 ORDER BY club_tb.created_at DESC OFFSET $3 LIMIT $4`;
            selectClubParam.push(smallCategory, offset, SEARCH.MAX_CLUB_PER_PAGE);
        }
        const selectClubData = await pool.query(selectClubSql, selectClubParam);
        result.data = {
            club: selectClubData.rows
        }

    } catch (error) {
        return next(error);
    }
    res.send(result);
});

// 동아리 검색 api (동아리 이름 기준)
router.get("/club-name/list", loginAuth, async (req, res, next) => {
});

// 동아리 내 게시글 검색 api
// 동아리 부원만 검색 가능
router.get("/post/list", loginAuth, async (req, res, next) => {
});

module.exports = router;
