
const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const validate = require('../module/validation');
const loginAuth = require("../middleware/loginAuth");
const managerAuth = require("../middleware/managerAuth");
const { BadRequestException } = require('../module/customError');
const { club } = require("../module/global");
const { position } = require("../module/global");
const CONSTRAINT = require("../module/constraint");

// 동아리 생성 api
router.post("/", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    }
    const {
        belong, bigCategory, smallCategory, name, cover, isRecruit, themeColor, profileImg, bannerImg
    } = req.body;
    const userId = req.decoded.id;
    let pgClient = null;

    try {
        validate(belong, "belong").checkInput().isNumber().checkLength(1, club.maxClubBelongLength);
        validate(bigCategory, "bigCategory").checkInput().isNumber().checkLength(1, club.maxClubBigCategoryLength);
        validate(smallCategory, "smallCategory").checkInput().isNumber().checkLength(1, club.maxClubSmallCategoryLength);
        validate(name, "name").checkInput().checkClubNameRegex();
        validate(cover, "cover").checkInput().checkLength(1, club.maxClubCoverLength);
        validate(isRecruit, "isRecruit").checkInput().isBoolean();
        validate(themeColor, "themeColor").checkInput().checkThemeColorRegex();

        pgClient = await pool.connect();
        // 트랜잭션 시작
        await pgClient.query("BEGIN");

        const createClubSql = `INSERT INTO 
                                        club_tb (belong, big_category, small_category, name, cover, is_recruit, profile_img, banner_img, theme_color)
                               VALUES
                                        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                               RETURNING
                                        id`;
        const createClubParam = [belong, bigCategory, smallCategory, name, cover, isRecruit, profileImg, bannerImg, themeColor];
        const createdClubData = await pool.query(createClubSql, createClubParam);
        const createdClubId = createdClubData.rows[0].id;

        const insertMemberSql = `INSERT INTO 
                                        club_member_tb (account_id, club_id, position) 
                                 VALUES 
                                        ($1, $2, $3)`;
        const insertMemberParam = [userId, createdClubId, position.president];
        await pool.query(insertMemberSql, insertMemberParam);

        // 트랜잭션 커밋
        await pgClient.query("COMMIT");

        result.message = "동아리 생성 성공";
        result.data = {
            "clubId": createdClubId
        }
        return res.send(result);

    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK");
        }
        if (error.constraint === CONSTRAINT.uniqueClubName) {
            next(new BadRequestException("이미 존재하는 동아리 이름입니다"))
        }
        if (error.constraint === CONSTRAINT.fkBelong) {
            next(new BadRequestException("해당하는 소속이 존재하지 않습니다"));
        }
        if (error.constraint === CONSTRAINT.fkBigCategory) {
            next(new BadRequestException("해당하는 대분류가 존재하지 않습니다"))
        }
        if (error.constraint === CONSTRAINT.fkSmallCategory) {
            next(new BadRequestException("해당하는 소분류가 존재하지 않습니다"));
        }
        next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }
});

// 동아리 프로필 조회 api
router.get("/:clubId/profile", loginAuth, async (req, res, next) => {
    const { clubId } = req.params;
    const result = {
        message: "",
        data: {}
    }
    try {
        validate(clubId, "clubId").checkInput().isNumber();

        const selectedClubSql = `SELECT 
                                        club_tb.name AS name, 
                                        belong_tb.name AS belong, 
                                        big_category_tb.name AS bigCategory, 
                                        small_category_tb.name AS smallCategory, 
                                        club_tb.profile_img AS profileImage, 
                                        club_tb.cover AS cover, 
                                        club_tb.created_at AS createdAt
                                 FROM 
                                        club_tb
                                 JOIN 
                                        belong_tb ON club_tb.belong = belong_tb.id
                                 JOIN   
                                        big_category_tb ON club_tb.big_category = big_category_tb.id
                                 JOIN   
                                        small_category_tb ON club_tb.small_category = small_category_tb.id
                                 WHERE 
                                        club_tb.id = $1`
        const selectedClubParams = [clubId];

        const clubProfiledata = await pool.query(selectedClubSql, selectedClubParams);
        if (clubProfiledata.rowCount === 0) {
            throw new BadRequestException("해당하는 동아리가 존재하지 않습니다");
        }
        result.data = {
            club: clubProfiledata.rows[0]
        }
        return res.send(result);

    } catch (error) {
        next(error);
    }
});

// 동아리 관리자 페이지 (동아리 프로필)api
// 논의 필요
router.get("/:clubId/manage", loginAuth, managerAuth, async (req, res, next) => {
});

// 동아리 수정 api
router.put("/", loginAuth, managerAuth, async (req, res, next) => {
    const {
        name, cover, isAllowJoin, themeColor, bannerImg, profileImg
    } = req.body;
    const { clubId } = req.body;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(name, "name").checkInput().checkClubNameRegex();
        validate(cover, "cover").checkInput().checkLength(1, club.maxClubCoverLength);
        validate(isAllowJoin, "isAllowJoin").checkInput();
        validate(themeColor, "themeColor").checkInput().checkThemeColorRegex();
        validate(bannerImg, "bannerImg").checkInput().checkLength(1, club.maxBannerImageLength);
        validate(profileImg, "profileImg").checkInput().checkLength(1, club.maxProfileImageLength);

        const modifyClubProfileSql = `UPDATE 
                                            club_tb
                                      SET 
                                            name = $1, 
                                            cover = $2, 
                                            is_recruit = $3, 
                                            theme_color = $4, 
                                            banner_img = $5, 
                                            profile_img = $6 
                                      WHERE 
                                            id = $7`;
        const modifyClubProfileParam = [
            name, cover, isAllowJoin, themeColor, bannerImg, profileImg,
            clubId
        ];
        const modifyClubProfileData = await pool.query(modifyClubProfileSql, modifyClubProfileParam);
        if (modifyClubProfileData.rowCount !== 0) {
            result.message = "수정 성공";
            return res.send(result);
        }

    } catch (error) {
        next(error);
    }
});

// 동아리 이름 중복 체크 api
router.get("/duplicate/club-name/:clubName", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    };
    const { clubName } = req.params;

    // 공백 제거 한 clubName 과 공백 제거 한 club_tb(name)을 비교
    const removeSpaceClubName = clubName.replace(/\s+/g, ''); // 공백 제거
    try {
        validate(removeSpaceClubName, "club-name").checkInput().checkClubNameRegex();
        const selectClubNameSql = `SELECT name FROM club_tb WHERE REPLACE(name, ' ', '') = $1`;
        const selectClubNameParam = [removeSpaceClubName];
        const selectClubNameData = await pool.query(selectClubNameSql, selectClubNameParam);
        if (selectClubNameData.rowCount === 0) {
            result.message = "사용 가능한 이름입니다";
            return res.send(result);
        }
        throw new BadRequestException("해당하는 동아리 이름이 존재합니다");

    } catch (error) {
        next(error);
    }
});

// 동아리 가입 신청 승인 api
router.post("/member", loginAuth, managerAuth, async (req, res, next) => {
    const { userId, clubId } = req.body;
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(userId, "userId").checkInput().isNumber().checkLength(1, 5);
        validate(clubId, "clubId").checkInput().isNumber().checkLength(1, 5);

        const insertMemberSql = `INSERT INTO 
                                            club_member_tb (account_id, club_id, position)
                                   VALUES
                                            ($1, $2, $3)`;
        const insertedMemberParams = [userId, clubId, position.member];
        const data = await pool.query(insertMemberSql, insertedMemberParams);
        result.data = data;
        res.send(result);

    } catch (error) {
        if (error.constraint === constraint.uniqueClubMember) {
            return next(new BadRequestException("해당하는 부원이 이미 존재합니다"));
        }
        if (error.constraint === constraint.fkAccount) {
            return next(new BadRequestException("해당하는 사용자가 존재하지 않습니다"));
        }
        next(error);
    }
});

module.exports = router;
