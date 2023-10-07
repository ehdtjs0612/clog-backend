require("dotenv").config()
const router = require("express").Router()
const client = require("mongodb").MongoClient
const validate = require("../module/validation")
const { notification } = require("../module/global")
const { BadRequestException } = require("../module/customError")
const loginAuth = require("../middleware/auth/loginAuth");
const notificationSentence = require("../module/notificationSentence")
const { ObjectId } = require("mongodb")

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

        const filter = { user_id: userId }
        const sort = { _id: -1 }
        const data = await conn.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION).find(filter).sort(sort).limit(notification.limit).toArray()
        result.data = notificationSentence(data)
        result.message = "알림 목록 조회 성공"

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

// 알림 하나 읽음 처리
router.post("/read", loginAuth, async (req, res, next) => {
    const { notificationId } = req.body
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(notificationId, "notificationId").checkInput().checkLength(notification.idLength, notification.idLength)
        conn = await client.connect(process.env.MONGODB_URL)

        const filter = { _id: new ObjectId(notificationId) }
        const update = { $set: { is_read: true } }
        const data = await conn.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION).updateOne(filter, update)
        console.log(data)

        if (data.matchedCount == 0) throw new BadRequestException("해당 알림이 존재하지 않습니다")
        result.message = "알림 읽음 처리 성공"

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

        const userFilter = { user_id: userId }
        const isReadFilter = { is_read: false }
        const update = { $set: { is_read: true } }
        const pipeline = [
            { $match: userFilter },
            { $limit: notification.limit },
            { $match: isReadFilter },
            { $project: { _id: 1 } }
        ]

        const find = await conn.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION).aggregate(pipeline).toArray()
        const idList = find.map(elem => elem._id)
        const data = await conn.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION).updateMany({ _id: { $in: idList } }, update)

        result.message = "알림 모두 읽음 처리 성공"

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

// 읽지않은 알림 개수 세기
router.get("/count", loginAuth, async (req, res, next) => {
    const userId = req.decoded.id
    console.log(userId)
    const result = {
        message: "",
        data: {}
    }

    let conn

    try {
        conn = await client.connect(process.env.MONGODB_URL)

        const userFilter = { user_id: userId }
        const isReadFilter = { is_read: false }
        const pipeline = [
            { $match: userFilter },
            { $limit: notification.limit },
            { $match: isReadFilter },
            { $count: "count" }
        ]
        const data = await conn.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION).aggregate(pipeline).toArray()
        result.data = data
        result.message = "안읽은 알림 개수 조회 성공"

        res.send(result)
    } catch (error) {
        if (conn) conn.close()
        next(error)
    }
})

module.exports = router