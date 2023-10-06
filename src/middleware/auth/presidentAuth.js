const pool = require("../../../config/database/postgresql");
const validate = require("../../module/validation");
const { position: POSITION } = require("../../module/global");
const { ForbbidenException } = require('../../module/customError');

module.exports = async (req, res, next) => {
    const userId = req.decoded.id;
    const clubId = req.params.clubId ?? req.body.clubId;

    try {
        validate(clubId, "clubId").checkInput().isNumber();


        const selectPositionSql = `SELECT 
                                        position 
                                   FROM 
                                        club_member_tb
                                   WHERE 
                                        account_id = $1 AND club_id = $2;`
        const selectPositionParam = [userId, clubId];
        const selectPositionData = await pool.query(selectPositionSql, selectPositionParam);
        if (selectPositionData.rowCount !== 0) {
            if (selectPositionData.rows[0].position !== POSITION.PERSIDENT) {
                return next();
            };
        }
        throw new ForbbidenException("회장 권한이 필요합니다");

    } catch (error) {
        next(error);
    }
}
