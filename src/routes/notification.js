require("dotenv").config()
const router = require("express").Router()
const validate = require("../module/validation")
const client = require("mongodb").MongoClient
const { BadRequestException } = require("../module/customError")
const loginAuth = require("../middleware/loginAuth")
const notificationSentence = require("../module/notificationSentence")
const { ObjectId } = require("mongodb")
const { user } = require("pg/lib/defaults")

// 알림 목록 조회
router.get("/list", loginAuth, async (req, res, next) => { 
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let conn

    try {
        conn = await client.connect(process.env.MONGODB_URL)

        const filter = {user_id : userId}
        const data = await conn.db("clog_mongodb").collection("notification").find(filter).toArray()
        result.data = notificationSentence(data)

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

// 알림 하나 읽음 처리
router.post("/read", loginAuth, async (req, res, next) => {
    const { notificationId } = req.body
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    try {
        conn = await client.connect(process.env.MONGODB_URL)

        const filter = {_id: new ObjectId(notificationId)}
        const update = {$set: {is_read : true}}
        const data = await conn.db("clog_mongodb").collection("notification").updateOne(filter, update)
        console.log(data)

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

// 알림 모두 읽음 처리
router.post("/read-all", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    try {
        conn = await client.connect(process.env.MONGODB_URL)

        const filter = {user_id: userId}
        const update = {$set: {is_read : true}}
        const data = await conn.db("clog_mongodb").collection("notification").updateMany(filter, update)
        console.log(data)

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

// 읽지않은 알림 개수 세기
router.get("/count", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id
    const result = {
        message: "",
        data: {}
    }

    let conn

    try {
        conn = await client.connect(process.env.MONGODB_URL)
        
        const filter = {$and : [{user_id : userId}, {is_read : false}]}
        const data = await conn.db("clog_mongodb").collection("notification").countDocuments(filter)
        console.log(data)
        result.data.count = data

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

module.exports = router