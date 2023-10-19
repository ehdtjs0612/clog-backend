const router = require("express").Router()
const pool = require("../../../config/database/postgresql")
const loginAuth = require("../../middleware/auth/loginAuth")
const validate = require("../../module/validation")
const { NOTICE, NOTICE_COMMENT } = require("../../module/global")
const { BadRequestException } = require("../../module/customError")

// 공지 답글 작성
router.post("/", loginAuth, async (req, res, next) => {
    const { commentId, content } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let pgClient = null

    try {
        pgClient = await pool.connect()
        await pgClient.query("BEGIN")

        const Sql = ``
        const Params = []
        const SqlResult = await pgClient.query(Sql,Params)


        await pgClient.query("COMMIT")
    } catch (error) {
        if (pgClient) {
            await pgClient.query("ROLLBACK")
        }
        next(error)
    } finally {
        if (pgClient) pgClient.release
        res.send(result)
    }
})
module.exports = router