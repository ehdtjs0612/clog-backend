require("dotenv").config()
const router = require("express").Router()
const validate = require("../module/validation")
const client = require("mongodb").MongoClient
const { BadRequestException } = require("../module/customError")
const loginAuth = require("../middleware/loginAuth")

router.get("/list", loginAuth, async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    }

    let conn

    try {
        const userId = req.decoded.id

        conn = await client.connect(process.env.MONGODB_URL)
        const data = await conn.db("clog_mongodb").collection("notification").find({user_id : userId})
        console.log(data)

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

module.exports = router