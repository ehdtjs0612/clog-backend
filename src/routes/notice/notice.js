const router = require("express").Router();
const pool = require("../../../config/database/postgresql");
const loginAuth = require("../../middleware/auth/loginAuth");
const validate = require("../../module/validation");
const { CLUB, POST } = require("../../module/global");
const { BadRequestException } = require("../../module/customError");

// 동아리 공지 게시물 불러오는 api
router.get("/list/club/:clubId", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    };
    const { clubId } = req.params;
    const page = Number(req.query.page || 1);

    try {
        validate(clubId, "clubId").checkInput().isNumber();
        validate(page, 'page').isNumber().isPositive();

        const offset = (page - 1) * POST.MAX_POST_COUNT_PER_PAGE;
        const selectNoticeAllCountSql = `SELECT
                                                count(*)::int
                                          FROM
                                                notice_post_tb`;

        const selectNoticePostSql = `SELECT 
                                            notice_post_tb.id,
                                            notice_post_tb.title, 
                                            notice_post_tb.content, 
                                            notice_post_tb.is_fixed AS "isFixed", 
                                            TO_CHAR(notice_post_tb.created_at, 'YYYY-MM-DD') AS "createdAt", 
                                            account_tb.name AS "authorName",
                                            account_tb.personal_color AS "authorPcolor"
                                     FROM 
                                            notice_post_tb
                                     JOIN 
                                            account_tb ON notice_post_tb.account_id = account_tb.id
                                     WHERE 
                                            club_id = $1
                                     ORDER BY 
                                            notice_post_tb.created_at DESC 
                                     OFFSET 
                                            $2
                                     LIMIT 
                                            $3`;
        const selectNoticePostParam = [clubId, offset, POST.MAX_POST_COUNT_PER_PAGE];
        const noticeAllCountData = await pool.query(selectNoticeAllCountSql);
        const noticePostData = await pool.query(selectNoticePostSql, selectNoticePostParam);
        if (noticePostData.rowCount === 0) {
            throw new BadRequestException("해당하는 동아리에 공지글이 존재하지 않습니다");
        }

        result.data = {
            count: noticeAllCountData.rows[0].count,
            notice: noticePostData.rows
        }

    } catch (error) {
        return next(error);
    }

    res.send(result);
});

// 고정 공지 게시물 불러오는 api
router.get("/fixed/club/:clubId", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    }
    const { clubId } = req.params;

    try {
        const selectedFixedNoticeSql = `SELECT
                                                notice_post_tb.id,
                                                notice_post_tb.title,
                                                notice_post_tb.created_at AS "createdAt",
                                                account_tb.personal_color AS "authorPcolor",
                                                account_tb.name AS "authorName"
                                        FROM 
                                                notice_post_tb
                                        JOIN
                                                account_tb ON notice_post_tb.account_id = account_tb.id
                                        WHERE
                                                is_fixed = true
                                        AND
                                                club_id = $1
                                        LIMIT
                                                $2`;
        const selectedFixedNoticeParam = [clubId, CLUB.MAX_FIXED_NOTICE_COUNT_PER_PAGE];

        const data = await pool.query(selectedFixedNoticeSql, selectedFixedNoticeParam);
        if (data.rowCount !== 0) {
            throw new BadRequestException("고정 공지 게시글이 존재하지 않습니다");
        }

        result.data = {
            notice: data.rows
        }

    } catch (error) {
        return next(error);
    }

    res.send(result);
});

module.exports = router;
