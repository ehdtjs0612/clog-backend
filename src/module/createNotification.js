require("dotenv").config()
const pool = require("../../config/database/postgresql")
const client = require("mongodb").MongoClient
const { BadRequestException } = require("../module/customError")

const { notificationUrl } = require("../module/global")

const createNotification = async (url, key) => {
    let type
    let sql
    
    switch (url) { // api url에 따라 알림 type과 sql 설정
        case notificationUrl.clubComment :
            type = "club_comment"
            sql = `SELECT account_tb.name AS "author", 
                club_tb.name  AS "club_name",
                club_post_tb.account_id AS "user_id",
                club_tb.id AS "club_id" 
            FROM club_comment_tb 
            JOIN account_tb ON club_comment_tb.account_id = account_tb.id 
            JOIN club_post_tb ON club_comment_tb.club_post_id = club_post_tb.id
            JOIN club_board_tb ON club_post_tb.club_board_id = club_board_tb.id
            JOIN club_tb ON club_board_tb.club_id = club_tb.id
            WHERE club_comment_tb.id = $1`
            break

        case notificationUrl.clubReply:
            type = "club_reply"
            sql = `SELECT account_tb.name AS "author",
                    club_tb.name  AS "club_name",
                    club_comment_tb.account_id AS "user_id",
                    club_comment_tb.id AS "comment_id",
                    club_tb.id AS "club_id"
                FROM club_reply_tb 
                JOIN account_tb ON club_reply_tb.account_id = account_tb.id 
                JOIN club_comment_tb ON club_reply_tb.club_comment_id = club_comment_tb.id
                JOIN club_post_tb ON club_comment_tb.club_post_id = club_post_tb.id
                JOIN club_board_tb ON club_post_tb.club_board_id = club_board_tb.id
                JOIN club_tb ON club_board_tb.club_id = club_tb.id
                WHERE club_reply_tb.id = $1`
            break

        case notificationUrl.prComment:
            type = "pr_comment"
            sql = `WITH selected (club_id, post_id) 
                AS (SELECT promotion_post_tb.club_id,
                        promotion_post_tb.id
                    FROM promotion_comment_tb 
                    JOIN promotion_post_tb ON promotion_comment_tb.promotion_post_id = promotion_post_tb.id
                    WHERE promotion_comment_tb.id = $1)
                
                SELECT club_member_tb.account_id AS "user_id",
                    club_tb.name  AS "club_name",
                    selected.club_id AS "club_id",
                    selected.post_id AS "post_id"
                FROM selected, 
                    club_member_tb
                JOIN club_tb ON club_member_tb.club_id =club_tb.id
                WHERE club_tb.id = selected.club_id AND club_member_tb.position < 2`
            break

        case notificationUrl.prReply:
            type = "pr_reply"
            sql = `SELECT promotion_comment_tb.account_id AS "user_id",
                promotion_post_tb.id AS "post_id",
                promotion_comment_tb.id AS "comment_id"
            FROM promotion_reply_tb
            JOIN promotion_comment_tb ON promotion_reply_tb.promotion_comment_id = promotion_comment_tb.id
            JOIN promotion_post_tb ON promotion_comment_tb.promotion_post_id = promotion_post_tb.id
            WHERE promotion_reply_tb.id = $1`
            break

        case notificationUrl.notiComment:
            type = "noti_comment"
            sql = `SELECT account_tb.name AS "author",
                club_tb.name  AS "club_name",
                notice_post_tb.account_id AS "user_id",
                notice_post_tb.id AS "post_id",
                club_tb.id AS "club_id"
            FROM notice_comment_tb 
            JOIN account_tb ON notice_comment_tb.account_id = account_tb.id 
            JOIN notice_post_tb ON notice_comment_tb.notice_post_id = notice_post_tb.id
            JOIN club_tb ON notice_post_tb.club_id = club_tb.id
            WHERE notice_comment_tb.id = $1`
            break

        case notificationUrl.notiReply:
            type = "noti_reply"
            sql = `SELECT account_tb.name AS "author",
                club_tb.name  AS "club_name",
                notice_comment_tb.account_id AS "user_id",
                notice_comment_tb.id AS "comment_id",
                notice_post_tb.id AS "post_id",
                club_tb.id AS "club_id"
            FROM notice_reply_tb 
            JOIN account_tb ON notice_reply_tb.account_id = account_tb.id 
            JOIN notice_comment_tb ON notice_comment_tb.notice_post_id = notice_comment_tb.id
            JOIN notice_post_tb ON notice_comment_tb.notice_post_id = notice_post_tb.id
            JOIN club_tb ON notice_post_tb.club_id = club_tb.id
            WHERE notice_reply_tb.id = $1`
            break

        case notificationUrl.gradeUpdate:
            type = "grade_update"
            sql = `SELECT club_member_tb.account_id AS "user_id",
            club_member_tb.position AS "position",
            club_tb.name AS "club_name",
            club_tb.id AS "club_id"
            FROM club_member_tb
            JOIN club_tb ON club_member_tb.club_id = club_tb.id
            WHERE club_member_tb.id = $1`
            break

        case notificationUrl.joinAccept:
            type = "join_accept"
            sql = `SELECT club_member_tb.account_id AS "user_id",
            club_tb.name AS "club_name",
            club_tb.id AS "club_id"
            FROM club_member_tb
            JOIN club_tb ON club_member_tb.club_id = club_tb.id
            WHERE club_member_tb.id = $1`
            break
        default:
            break
    }

    const selectedData = await pool.query(sql, [key])
       
    if (selectedData.rowCount == 0) throw new BadRequestException("존재하지 않는 알림입니다")

    for (let index = 0; index < selectedData.rowCount; index++) { // 몽고디비에 저장하기 위한 필드 추가
        selectedData.rows[index].type = type
        selectedData.rows[index].is_read = false
    }
    
    conn = await client.connect(process.env.MONGODB_URL) 

    if (selectedData.rowCount != 0) await conn.db("clog_mongodb").collection("notification").insertMany(selectedData.rows, { ignoreUndefined: true })

    console.log(selectedData.rows)
    // 답글 알림의 경우 댓글 알림으로 바꿔서 한번 더 실행
    if (type == "club_reply") {
        await createNotification(notificationUrl.clubComment, selectedData.rows[0].comment_id)
    }

    if (type == "noti_reply") {
        await createNotification(notificationUrl.notiComment, selectedData.rows[0].comment_id)
    }

    if (type == "pr_reply") {
        await createNotification(notificationUrl.prComment, selectedData.rows[0].comment_id)
    }

    await conn.close()
}

module.exports = createNotification 