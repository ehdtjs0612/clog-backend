const pool = require("../../../config/database/postgresql");
const validate = require("../../module/validation");
const { ForbbidenException } = require('../../module/customError');

module.exports = (position) => {
    return async (req, res, next) => {
        const userId = req.decoded.id;
        const clubId = req.params.clubId || req.body.clubId;

        try {
            validate(clubId, "clubId").checkInput().isNumber();

            const selectPositionSql = `SELECT 
                                                position 
                                       FROM 
                                                club_member_tb 
                                       WHERE 
                                                account_id = $1 AND club_id = $2`;
            const selectPositionParam = [userId, clubId];
            const selectPositionData = await pool.query(selectPositionSql, selectPositionParam);

            if (selectPositionData.rowCount === 0) {
                throw new ForbbidenException("로그인 사용자가 동아리에 가입된 사용자가 아닙니다");
            }

            if (selectPositionData.rows[0].position > position) {
                throw new ForbbidenException("관리자 권한이 필요합니다");
            }
        } catch (error) {
            next(error);
        }

        next();
    }
}
