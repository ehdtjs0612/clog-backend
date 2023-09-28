
const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const validate = require('../module/validation');
const mapping = require("../module/mapping");

// 동아리 생성 api
router.post("/", async (req, res, next) => {
    const {
        name, belong, bigCategory, smallCategory, cover, isAllowJoin, themeColor, bannerImg, profileImg
    } = req.body;
    let pgClient = null;

    try {

        // 받아온 데이터 (소속, 대분류, 소분류) 매핑
        const convertedBelong = mapping.getBelong(belong);
        const convertedBigCategory = mapping.getBigCategory(bigCategory);
        const convertedSmallCategory = mapping.getSmallCategory(smallCategory);

        pgClient = await pool.connect();
        // 트랜잭션 시작
        pgClient.query("BEGIN");

        const insertClubQuery = `INSERT INTO club_tb (name, cover, is_recruit, profile_img, banner_img, theme_color)
                                        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const insertClubParam = [name, cover, isAllowJoin, profileImg, bannerImg, themeColor];
        const insertClubData = await pgClient.query(insertClubQuery, insertClubParam);
        const createdClubId = insertClubData.rows[0].id;

        const insertBelongQuery = `INSERT INTO belong_tb (club_id, name)
                                          VALUES ($1, $2)`;
        const insertBelongParam = [createdClubId, convertedBelong];
        await pgClient.query(insertBelongQuery, insertBelongParam);

        const insertBigCategoryQuery = `INSERT INTO big_category_tb (club_id, name)
                                               VALUES ($1, $2)`;
        const insertBigCategoryParam = [createdClubId, convertedBigCategory];
        await pgClient.query(insertBigCategoryQuery, insertBigCategoryParam);

        const insertSmallCategoryQuery = `INSERT INTO small_category_tb (club_id, name)
                                                VALUES ($1, $2)`;
        const insertSmallCategoryParam = [createdClubId, convertedSmallCategory];
        await pgClient.query(insertSmallCategoryQuery, insertSmallCategoryParam);
        // 트랜잭션 커밋
        pgClient.query("COMMIT");
        res.send({
            message: "성공"
        });

    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK");
        }
        next(error);
    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

module.exports = router;
