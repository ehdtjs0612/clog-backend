require("dotenv").config()
const res = require("express/lib/response");
const pool = require("../../config/database/postgresql")
const client = require("mongodb").MongoClient
const {
    club_comment_url,
    club_reply_url,
    noti_comment_url,
    noti_reply_url,
    pr_comment_url,
    pr_reply_url,
    grade_update_url,
    join_accept_url
} = require("../module/global")

const createNotification = async (url, key) => {
    let type
    let sql

    try {
        switch (url) {
            case club_comment_url :
                type = "club_comment"
                sql = `SELECT account_tb.name AS "author", 
                    club_tb.name  AS "clubName",
                    club_post_tb.account_id AS "userId",
                    club_tb.id AS "clubId" 
                FROM club_comment_tb 
                JOIN account_tb ON club_comment_tb.account_id = account_tb.id 
                JOIN club_post_tb ON club_comment_tb.club_post_id = club_post_tb.id
                JOIN club_board_tb ON club_post_tb.club_board_id = club_board_tb.id
                JOIN club_tb ON club_board_tb.club_id = club_tb.id
                WHERE club_comment_tb.id = $1`
                break
    
            case club_reply_url :
                type = "club_reply"
                sql = `SELECT account_tb.name AS "author",
                        club_tb.name  AS "clubName",
                        club_comment_tb.account_id AS "userId",
                        club_tb.id AS "clubId"
                    FROM club_reply_tb 
                    JOIN account_tb ON club_reply_tb.account_id = account_tb.id 
                    JOIN club_comment_tb ON club_reply_tb.club_comment_id = club_comment_tb.id
                    JOIN club_post_tb ON club_comment_tb.club_post_id = club_post_tb.id
                    JOIN club_board_tb ON club_post_tb.club_board_id = club_board_tb.id
                    JOIN club_tb ON club_board_tb.club_id = club_tb.id
                    WHERE club_reply_tb.id = $1`
                break
    
            case pr_comment_url :
                type = "pr_comment"
                sql = `WITH selected (club_id, post_id) 
                    AS (SELECT promotion_post_tb.club_id,
                            promotion_post_tb.id
                        FROM promotion_comment_tb 
                        JOIN promotion_post_tb ON promotion_comment_tb.promotion_post_id = promotion_post_tb.id
                        WHERE promotion_comment_tb.id = $1)
                    
                    SELECT club_member_tb.account_id AS "userId",
                        club_tb.name  AS "clubName",
                        selected.club_id AS "clubId",
                        selected.post_id AS "postId"
                    FROM selected, 
                        club_member_tb
                    JOIN club_tb ON club_member_tb.club_id =club_tb.id
                    WHERE club_tb.id = selected.club_id AND club_member_tb.position < 2`
                break
    
            case pr_reply_url :
                type = "pr_reply"
                sql = `SELECT promotion_comment_tb.account_id AS "userId",
                    promotion_post_tb.id AS "postKey"
                FROM promotion_reply_tb
                JOIN promotion_comment_tb ON promotion_reply_tb.promotion_comment_id = promotion_comment_tb.id
                JOIN promotion_post_tb ON promotion_comment_tb.promotion_post_id = promotion_post_tb.id
                WHERE promotion_reply_tb.id = $1`
                break
    
            case noti_comment_url :
                type = "noti_comment"
                sql = `SELECT account_tb.name AS "author",
                    club_tb.name  AS "clubName",
                    notice_post_tb.account_id AS "userId",
                    notice_post_tb.id AS "postId",
                    club_tb.id AS "clubId"
                FROM notice_comment_tb 
                JOIN account_tb ON notice_comment_tb.account_id = account_tb.id 
                JOIN notice_post_tb ON notice_comment_tb.notice_post_id = notice_post_tb.id
                JOIN club_tb ON notice_post_tb.club_id = club_tb.id
                WHERE notice_comment_tb.id = $1`
                break
    
            case noti_reply_url :
                type = "noti_reply"
                sql = `SELECT account_tb.name AS "author",
                    club_tb.name  AS "clubName",
                    notice_comment_tb.account_id AS "userId",
                    notice_post_tb.id AS "postId",
                    club_tb.id AS "clubId"
                FROM notice_reply_tb 
                JOIN account_tb ON notice_reply_tb.account_id = account_tb.id 
                JOIN notice_comment_tb ON notice_comment_tb.notice_post_id = notice_comment_tb.id
                JOIN notice_post_tb ON notice_comment_tb.notice_post_id = notice_post_tb.id
                JOIN club_tb ON notice_post_tb.club_id = club_tb.id
                WHERE notice_reply_tb.id = $1`
                break
    
            case grade_update_url :
                type = "grade_update"
                sql = `SELECT club_member_tb.account_id AS "userId",
                club_member_tb.position AS "position",
                club_tb.name AS "clubName",
                club_tb.id AS "clubId"
                FROM club_member_tb
                JOIN club_tb ON club_member_tb.club_id = club_tb.id
                WHERE club_member_tb.id = $1`
                break
    
            case join_accept_url :
                type = "join_accept"
                sql = `SELECT club_member_tb.account_id AS "userId",
                club_tb.name AS "clubName",
                club_tb.id AS "clubId"
                FROM club_member_tb
                JOIN club_tb ON club_member_tb.club_id = club_tb.id
                WHERE club_member_tb.id = $1`
                break
            default :
                break
        }

        const selectedData = await pool.query(sql, [key])
        console.log(type)
        console.log(selectedData.rows)

        for (let index = 0; index < selectedData.rowCount; index++) {
            selectedData.rows[index].type = type
            selectedData.rows[index].is_read = false
        }

        conn = await client.connect(process.env.MONGODB_URL)

        if (selectedData.rowCount != 0) await conn.db("clog_mongodb").collection("notification").insertMany(selectedData.rows,{ignoreUndefined : true})

    } catch (error) {
        console.log(error)
    }
}

module.exports = createNotification 