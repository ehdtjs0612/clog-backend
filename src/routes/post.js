const router = require("express").Router();
const pool = require("../../config/database/postgresql");
const loginAuth = require('../middleware/auth/loginAuth');
const validate = require('../module/validation');
const CONSTRAINT = require("../module/constraint");
const { CLUB, POST, POSITION } = require('../module/global');
const { BadRequestException } = require('../module/customError');

// 동아리 내 전체 게시글을 가져오는 api
router.get("/list/club/:clubId", loginAuth, async (req, res, next) => {
    const { clubId } = req.params;
    const result = {
        message: "",
        data: {}
    };
    const page = Number(req.query.page || 1);

    try {
        validate(clubId, "clubId").checkInput().isNumber();
        validate(page, "page").isNumber().isPositive();

        const selectClubSql = `SELECT id FROM club_tb WHERE club_tb.id = $1`;
        const selectClubParam = [clubId];
        const selectClubData = await pool.query(selectClubSql, selectClubParam);

        if (!selectClubData.rowCount) {
            return next(new BadRequestException("존재하지 않는 동아리입니다."));
        }

        const offset = (page - 1) * POST.MAX_POST_COUNT_PER_PAGE;
        const selectAllPostCountSql = `SELECT 
                                            count(*)::int
                                        FROM
                                            club_post_tb
                                        JOIN
                                            club_board_tb
                                        ON
                                            club_board_tb.id = club_post_tb.club_board_id
                                        JOIN
                                            club_tb
                                        ON
                                            club_tb.id = club_board_tb.club_id
                                        WHERE
                                            club_tb.id = $1`;
        const selectAllPostCountParam = [clubId];
        const selectAllPostSql = `SELECT
                                            club_post_tb.id AS "postId",
                                            account_tb.name AS "authorName",
                                            club_post_tb.title AS "title",
                                            (
                                                SELECT
                                                    COUNT(*)
                                                FROM
                                                    club_comment_tb
                                                WHERE
                                                    club_comment_tb.club_post_id = club_post_tb.id
                                            )::int AS "commentCount",
                                            -- COUNT(club_comment_tb.id) AS "commentCount",
                                            club_post_tb.created_at AS createdAt
                                  FROM
                                            club_post_tb
                                  JOIN
                                            account_tb ON club_post_tb.account_id = account_tb.id
                                  JOIN 
                                            club_board_tb ON club_post_tb.club_board_id = club_board_tb.id 
                                  WHERE 
                                            club_board_tb.club_id = $1
                                  ORDER BY
                                            club_post_tb.created_at DESC
                                  OFFSET
                                            $2
                                  LIMIT
                                            $3`;
        const selectAllPostParam = [clubId, offset, CLUB.MAX_ALL_POST_COUNT_PER_PAGE];
        const selectAllPostCountData = await pool.query(selectAllPostCountSql, selectAllPostCountParam);
        const selectAllPostData = await pool.query(selectAllPostSql, selectAllPostParam);
        result.data = {
            count: selectAllPostCountData.rows[0].count,
            posts: selectAllPostData.rows
        }

    } catch (error) {
        return next(error);
    }
    res.send(result);
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

    } catch (error) {
        return next(error);
    }
    res.send(result);
});

// 게시물 조회 api
router.get("/:postId", loginAuth, async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.decoded.id;
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
                                        TO_CHAR(club_post_tb.created_at, 'yyyy.mm.dd') AS "createdAt",
                                        club_post_tb.account_id = $2 AS "authorState"
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
        const selectPostParam = [postId, userId];
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

// 게시물 작성 api
router.post("/", loginAuth, async (req, res, next) => {
    const { boardId, title, content, images } = req.body;
    const userId = req.decoded.id;
    const result = {
        message: "",
        data: {}
    }
    let pgClient = null;

    try {
        validate(boardId, "boardId").checkInput().isNumber();
        validate(title, "title").checkInput().checkLength(1, POST.MAX_POST_TITLE_LENGTH);
        validate(content, "content").checkInput().checkLength(1, POST.MAX_POST_CONTENT_LENGTH);

        pgClient = await pool.connect();
        await pgClient.query("BEGIN");
        // 1. 게시글 테이블에 삽입
        const insertPostSql = `INSERT INTO 
                                        club_post_tb (club_board_id, account_id, title, content) 
                               VALUES 
                                        ($1, $2, $3, $4) 
                               RETURNING 
                                        id`;
        const insertPostParam = [boardId, userId, title, content];
        const insertPostData = await pgClient.query(insertPostSql, insertPostParam);

        // 2. 게시글 이미지 테이블에 이미지 삽입
        const insertPostImageSql = `INSERT INTO 
                                            post_img_tb (post_id, post_img) 
                                    SELECT 
                                            $1, UNNEST($2::VARCHAR[])`;
        const insertPostImageParam = [insertPostData.rows[0].id, images];
        await pgClient.query(insertPostImageSql, insertPostImageParam);

        await pgClient.query("COMMIT");
        result.data = {
            "postId": insertPostData.rows[0].id
        };

    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK");
        }
        if (error.constraint === CONSTRAINT.FK_BOARD) {
            return next(new BadRequestException("해당하는 게시판이 존재하지 않습니다"));
        }
        return next(error);

    } finally {
        if (pgClient) {
            pgClient.release();
        }
    }

    res.send(result);
});

// 게시글 수정 api
router.put("/", loginAuth, async (req, res, next) => {
    const { postId, title, content, images } = req.body;
    const userId = req.decoded.id;
    const result = {
        message: "",
        data: {}
    }
    let pgClient = null;

    try {
        validate(postId, "postId").checkInput().isNumber();
        validate(title, "title").checkInput().checkLength(1, POST.MAX_POST_TITLE_LENGTH);
        validate(content, "content").checkInput().checkLength(1, POST.MAX_POST_CONTENT_LENGTH);

        pgClient = await pool.connect();
        await pgClient.query("BEGIN");
        // 본인이 쓴 글이거나 position 0 or 1
        const selectPositionSql = `SELECT
                                        club_post_tb.account_id AS "accountId",
                                        (
                                            SELECT
                                                club_member_tb.position
                                            FROM
                                                club_member_tb
                                            WHERE
                                                club_member_tb.club_id = club_tb.id
                                            AND
                                                club_member_tb.account_id = $2
                                        ) AS position
                                    FROM    
                                        club_post_tb
                                    JOIN
                                        club_board_tb
                                    ON
                                        club_board_tb.id = club_post_tb.club_board_id
                                    JOIN
                                        club_tb
                                    ON
                                        club_board_tb.club_id = club_tb.id
                                    WHERE
                                        club_post_tb.id = $1`;
        const selectPositionResult = await pgClient.query(selectPositionSql, [postId, userId]);

        if (selectPositionResult.rowCount === 0) {
            return next(new BadRequestException("게시글이 존재하지 않습니다."));
        }

        if (selectPositionResult.rows[0].accountId !== userId && selectPositionResult.rows[0].position >= POSITION.MANAGER) {
            return next(new BadRequestException("수정 권한이 존재하지 않습니다."));
        }

        // 1. 게시글 본문 (title, content)수정
        const updatePostSql = `UPDATE 
                                        club_post_tb 
                               SET 
                                        title = $1,
                                        content = $2 
                               WHERE 
                                        id = $3`;
        const updatePostParam = [title, content, postId];
        await pgClient.query(updatePostSql, updatePostParam);

        // 2. 기존의 게시글 이미지 삭제
        const deletePostImageSql = `DELETE FROM 
                                                post_img_tb
                                    WHERE
                                                 post_id = $1`;
        const deletePostImageParam = [postId];
        await pgClient.query(deletePostImageSql, deletePostImageParam);
        // 3. 다시 게시글 이미지 테이블에 이미지 업로드
        const insertPostImageSql = `INSERT INTO 
                                                post_img_tb (post_id, post_img) 
                                    SELECT 
                                                $1, UNNEST($2::VARCHAR[])`;
        const insertPostImageParam = [postId, images];
        await pgClient.query(insertPostImageSql, insertPostImageParam);

        await pgClient.query("COMMIT");
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK");
        }
        if (error.constraint === CONSTRAINT.FK_CLUB_POST_TO_IMG_TB) {
            return next(new BadRequestException("해당하는 게시글이 존재하지 않습니다"));
        }
        return next(error);

    } finally {
        if (pgClient) {
            pgClient.release;
        }
    }

    res.send(result);
});

// 게시글 삭제 api
router.delete("/", loginAuth, async (req, res, next) => {
    const { postId } = req.body;
    const userId = req.decoded.id;

    try {
        // 본인이 쓴 글이거나 position 0 or 1
        const selectAuthorSql = `SELECT 
                                    account_id AS "accountId", 
                                    (
                                        SELECT 
                                            club_member_tb.position 
                                        FROM 
                                            club_member_tb 
                                        WHERE 
                                            account_id = $1 
                                        AND 
                                            club_id = club_tb.id
                                    ) AS "position"
                                 FROM
                                    club_post_tb
                                 JOIN
                                    club_board_tb
                                 ON
                                    club_board_tb.id = club_post_tb.club_board_id
                                 JOIN
                                    club_tb
                                 ON
                                    club_tb.id = club_board_tb.club_id
                                 WHERE
                                    club_post_tb.id = $2`;
        const selectAuthorParam = [userId, postId];
        const selectAuthorData = await pool.query(selectAuthorSql, selectAuthorParam);
        if (selectAuthorData.rowCount === 0) {
            throw new BadRequestException("해당하는 게시글이 존재하지 않습니다");
        }
        if (selectAuthorData.rows[0].accountId !== userId && selectAuthorData.rows[0].position >= POSITION.MANAGER) {
            throw new BadRequestException("삭제 권한이 존재하지 않습니다");
        }

    } catch (error) {
        return next(error);
    }
    res.send(result);
});

module.exports = router;
