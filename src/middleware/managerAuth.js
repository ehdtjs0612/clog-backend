const pool = require("../../config/database/postgresql");
const { position } = require("../module/global");
const { NotFoundException } = require('../module/customError');

module.exports = async (req, res, next) => {
    const userId = req.decoded.id;
    const clubId = req.params.clubId ?? req.body.clubId;

    try {
        const selectPositionSql = `SELECT position FROM club_member_tb WHERE account_id = $1 AND club_id = $2`;
        const selectPositionParam = [userId, clubId];
        const selectPositionData = await pool.query(selectPositionSql, selectPositionParam);
        if (selectPositionData.rowCount !== 0) {
            if (selectPositionData.rows[0].position !== position.member);
            return next();
        }
        throw new NotFoundException("해당하는 페이지가 존재하지 않습니다");

    } catch (error) {
        next(error);
    }
}
