const loginAuth = require('../middleware/auth/loginAuth');
const { CLUB } = require('../module/global');
const validate = require('../module/validation');
const pool = require("../../config/database/postgresql");

const router = require("express").Router();

// 동아리 내 전체 게시글을 가져오는 api
router.get("/list/club/:clubId", loginAuth, async (req, res, next) => {
    const { clubId } = req.params;
    const result = {
        message: "",
        data: {}
    };
    let page = req.query.page ?? 1;
    if (page < 1) page = 1;

    try {
        validate(clubId, "clubId").checkInput().isNumber();

        const offset = (page - 1) * CLUB.MAX_POST_COUNT_PER_PAGE;
        const selectAllPostCountSql = `SELECT 
                                                count(*)::int
                                       FROM
                                                club_post_tb`;
        const selectAllPostSql = `SELECT
                                            club_post_tb.id AS "postId",
                                            account_tb.name AS "authorName",
                                            club_post_tb.title AS "title",
                                            COUNT(club_comment_tb.id) AS "commentCount",
                                            club_post_tb.created_at AS createdAt
                                  FROM
                                            club_post_tb
                                  JOIN
                                            account_tb ON club_post_tb.account_id = account_tb.id
                                  LEFT JOIN
                                            club_comment_tb ON club_post_tb.id = club_comment_tb.club_post_id 
                                  JOIN 
                                            club_board_tb ON club_post_tb.club_board_id = club_board_tb.id 
                                  WHERE 
                                            club_board_tb.club_id = $1
                                  GROUP BY
                                            club_post_tb.id, account_tb.name, club_post_tb.title, club_post_tb.created_at
                                  ORDER BY
                                            club_post_tb.created_at DESC
                                  OFFSET
                                            $2
                                  LIMIT
                                            $3`;
        const selectAllPostParam = [clubId, offset, CLUB.MAX_ALL_POST_COUNT_PER_PAGE];
        const selectAllPostCountData = await pool.query(selectAllPostCountSql);
        const selectAllPostData = await pool.query(selectAllPostSql, selectAllPostParam);
        if (selectAllPostData.rowCount !== 0) {
            result.data = {
                count: selectAllPostCountData.rows[0].count,
                posts: selectAllPostData.rows
            }
        }
        result.message = "해당 동아리에 게시글이 존재하지 않습니다";
        return res.send(result);

    } catch (error) {
        next(error);
    }
});

module.exports = router;
