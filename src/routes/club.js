
const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const validate = require('../module/validation');
const mapping = require("../module/mapping");
const { BadRequestException } = require('../module/customError');

// 동아리 생성 api
router.post("/", async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    }
    const {
        name, belong, bigCategory, smallCategory, cover, isAllowJoin, themeColor, bannerImg, profileImg
    } = req.body;
    let pgClient = null;

    try {
        validate(name, "name").checkInput().checkClubNameRegex();
        validate(cover, "cover").checkInput().checkLength(0, 500);
        validate(isAllowJoin, "isAllowJoin").checkInput().isBoolean();
        validate(themeColor, "themeColor").checkInput().checkThemeColorRegex();
        validate(belong, "belong").checkInput().isNumber().checkLength(1, 5);
        validate(bigCategory, "bigCategory").checkInput().isNumber().checkLength(1, 5);
        validate(smallCategory, "smallCategory").checkInput().isNumber().checkLength(1, 5);

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

        result.message = "동아리 생성 성공";
        result.data = {
            "clubId": createdClubId
        }
        res.send(result);

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

// 동아리 프로필 조회 api
router.get("/:clubId/profile", async (req, res, next) => {
    const { clubId } = req.params;
    const result = {
        message: "",
        data: {}
    }
    try {
        validate(clubId, "clubId").checkInput().isNumber().checkLength(1, 5);

        const selectedClubSql = `SELECT club_tb.name AS name, belong_tb.name AS belong, big_category_tb.name AS bigCategory, small_category_tb.name AS smallCategory, club_tb.profile_img AS profileImage, club_tb.cover AS cover, club_tb.created_at AS createdAt
                                        FROM club_tb
                                        JOIN belong_tb ON club_tb.id = belong_tb.club_id
                                        JOIN big_category_tb ON club_tb.id = big_category_tb.club_id
                                        JOIN small_category_tb ON club_tb.id = small_category_tb.club_id
                                        WHERE club_tb.id = $1`
        const selectedClubParams = [clubId];

        const clubProfiledata = await pool.query(selectedClubSql, selectedClubParams);
        if (clubProfiledata.rowCount === 0) {
            throw new BadRequestException("해당하는 동아리가 존재하지 않습니다");
        }
        result.data = {
            club: clubProfiledata.rows
        }
        res.send(result);

    } catch (error) {
        next(error);
    }
});

module.exports = router;
