const loginAuth = require('../middleware/auth/loginAuth');
const { CLUB } = require('../module/global');
const validate = require('../module/validation');
const pool = require("../../config/database/postgresql");
const { BadRequestException } = require('../module/customError');

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

// 게시판의 게시물 리스트 조회 api
router.get("/list/board/:boardId", loginAuth, async (req, res, next) => {
    const { boardId } = req.params;
    const result = {
        message: "",
        data: {}
    };
    let page = req.query.page ?? 1;
    if (page < 1) page = 1;

    try {
        validate(boardId, "boardId").checkInput().isNumber();
        const offset = (page - 1) * CLUB.MAX_POST_COUNT_PER_PAGE;

        const selectPostOfBoardSql = `SELECT 
                                            club_post_tb.id, 
                                            club_post_tb.title, 
                                            account_tb.name AS "authorName", 
                                            club_post_tb.created_at AS "createdAt" 
                                      FROM 
                                            club_post_tb 
                                      JOIN 
                                            account_tb ON club_post_tb.account_id = account_tb.id 
                                      WHERE 
                                            club_board_id = $1 
                                      OFFSET 
                                            $2 
                                      LIMIT 
                                            $3`;
        const selectPostOfBoardParam = [boardId, offset, CLUB.MAX_POST_COUNT_PER_PAGE];
        const selectPostOfBoardData = await pool.query(selectPostOfBoardSql, selectPostOfBoardParam);
        if (selectPostOfBoardData.rowCount !== 0) {
            result.data = {
                posts: selectPostOfBoardData.rows
            }
        }
        return res.send(result);

    } catch (error) {
        next(error);
    }
});

// 게시물 조회 api
router.get("/:postId", loginAuth, async (req, res, next) => {
    const { postId } = req.params;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(postId, "postId").checkInput().isNumber();

        const selectPostSql = `SELECT 
                                        club_post_tb.account_id AS "authorId", 
                                        major_tb.name AS "authorMajor", 
                                        account_tb.name AS "authorName", 
                                        account_tb.personal_color AS "authorPcolor", 
                                        account_tb.entry_year AS "authorEntryYear", 
                                        club_post_tb.title AS "postTitle", 
                                        club_post_Tb.content AS "postContent", 
                                        ARRAY_AGG(post_img_tb.post_img) AS "postImages", 
                                        TO_CHAR(club_post_tb.created_at, 'yyyy.mm.dd') AS "createdAt" 
                               FROM 
                                        club_post_tb 
                               JOIN 
                                        account_tb ON club_post_tb.account_id = account_tb.id 
                               JOIN 
                                        major_tb ON account_tb.major = major_tb.id 
                               LEFT JOIN 
                                        post_img_tb ON club_post_tb.id = post_img_tb.post_id 
                               WHERE 
                                        club_post_tb.id = $1
                               GROUP BY 
                                        club_post_tb.account_id, 
                                        major_tb.name, 
                                        account_tb.name, 
                                        account_tb.personal_color, 
                                        account_tb.entry_year, 
                                        club_post_tb.title, 
                                        club_post_tb.content, 
                                        club_post_tb.created_at`;
        const selectPostParam = [postId];
        const selectPostData = await pool.query(selectPostSql, selectPostParam);
        if (selectPostData.rowCount !== 0) {
            result.data = {
                posts: selectPostData.rows,
            }
            return res.send(result);
        }
        throw new BadRequestException("해당하는 게시글이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

module.exports = router;
