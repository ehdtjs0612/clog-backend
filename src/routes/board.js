const router = require("express").Router();
const pool = require('../../config/database/postgresql');
const loginAuth = require('../middleware/auth/loginAuth');
const authCheck = require("../middleware/auth/authCheck");
const validate = require('../module/validation');
const { CLUB, BOARD, POSITION } = require("../module/global");
const { BadRequestException } = require('../module/customError');

// 게시판 리스트 조회 api
router.get("/list/club/:clubId", loginAuth, async (req, res, next) => {
    const { clubId } = req.params;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(clubId, "clubId").checkInput().isNumber();

        const selectBoardListSql = `SELECT id, name FROM club_board_tb WHERE club_id = $1`;
        const selectBoardListParam = [clubId];
        const selectBoardListData = await pool.query(selectBoardListSql, selectBoardListParam);
        if (selectBoardListData.rowCount !== 0) {
            result.data = {
                boards: selectBoardListData.rows
            }
            res.send(result);
        }
    }
    catch (error) {
        next(error);
    }
});

// 게시판 생성 api
router.post("/", loginAuth, authCheck(POSITION.MANAGER), async (req, res, next) => {
    const { clubId, name } = req.body;
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(name, "name").checkInput().checkLength(1, BOARD.MAX_BOARD_LENGTH);

        const createBoardSql = `INSERT INTO
                                            club_board_tb (club_id, name)
                                SELECT
                                            $1, $2
                                WHERE 
                                            (SELECT 
                                                    COUNT(*) 
                                             FROM
                                                    club_board_tb 
                                             WHERE 
                                                    club_id = $3) < $4
                                RETURNING id`;
        const createBoardParam = [clubId, name, clubId, CLUB.MAX_BOARD_COUNT];
        const createBoardData = await pool.query(createBoardSql, createBoardParam);
        if (createBoardData.rowCount !== 0) {
            result.message = "게시판 생성 성공";
            result.data = createBoardData.rows[0].id;
            return res.send(result);
        }
        throw new BadRequestException(`게시판의 최대 수는 ${CLUB.MAX_BOARD_COUNT}개입니다`)

    } catch (error) {
        next(error);
    }
});

// 게시판 수정 api
router.put("/", loginAuth, authCheck(POSITION.MANAGER), async (req, res, next) => {
    const { boardId, name } = req.body;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(name, "name").checkInput().checkLength(1, BOARD.MAX_BOARD_LENGTH);
        validate(boardId, "boardId").checkInput().isNumber();

        const updateBoardSql = `UPDATE club_board_tb SET name = $1 WHERE id = $2`;
        const updateBoardParams = [name, boardId];
        const updateBoardData = await pool.query(updateBoardSql, updateBoardParams);
        if (updateBoardData.rowCount !== 0) {
            result.message = "게시판 수정 성공";
            return res.send(result);
        }
        throw new BadRequestException("해당하는 게시판이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

// 게시판 삭제 api
router.delete("/", loginAuth, authCheck(POSITION.MANAGER), async (req, res, next) => {
    const { boardId } = req.body;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(boardId, "boardId").checkInput().isNumber();

        const deleteBoardSql = `DELETE FROM
                                            club_board_tb
                                WHERE
                                            id = $1`;
        const deleteBoardParam = [boardId];
        const deleteBoardData = await pool.query(deleteBoardSql, deleteBoardParam);
        if (deleteBoardData.rowCount !== 0) {
            return res.send(result);
        }
        throw new BadRequestException("해당하는 게시판이 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
});

module.exports = router;
