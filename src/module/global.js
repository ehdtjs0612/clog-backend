module.exports = {
    // account
    maxEmailLength: 60,
    maxPwLength: 60,

    // auth
    certifiedLength: 5,
    certifiedExpireTime: 180,

    // club
    maxClubCoverLength: 500,
    maxClubBelongLength: 5,
    maxClubBigCategoryLength: 5,
    maxClubSmallCategoryLength: 5,
    maxBannerImageLength: 20000,
    maxProfileImageLength: 20000,

    // position
    position: {
        president: 0,
        manager: 1,
        member: 2
    },

    // notification url
    club_comment_url : "/comment",
    club_reply_url : "/reply",
    noti_comment_url : "/notice/comment",
    noti_reply_url : "/notice/reply",
    pr_comment_url : "/promotion/comment",
    pr_reply_url : "/promotion/reply",
    grade_update_url : "/club/position",
    join_accept_url : "/club/member"
}