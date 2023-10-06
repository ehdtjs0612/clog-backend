module.exports = {
    account: {
        maxEmailLength: 60,
        maxPwLength: 60
    },

    auth: {
        certifiedLength: 5,
        certifiedExpireTime: 180,
    },

    club: {
        maxClubCoverLength: 500,
        maxClubBelongLength: 5,
        maxClubBigCategoryLength: 5,
        maxClubSmallCategoryLength: 5,
        maxBannerImageLength: 20000,
        maxProfileImageLength: 20000,
        maxPostCountPerPage: 10,
        maxFixedNoticeCountPerPage: 5
    },

    position: {
        president: 0,
        manager: 1,
        member: 2
    },

    notificationUrl: {
        clubComment : "/comment",
        clubReply : "/reply",
        notiComment : "/notice/comment",
        notiReply : "/notice/reply",
        prComment : "/promotion/comment",
        prReply : "/promotion/reply",
        gradeUpdate : "/club/position",
        joinAccept : "/club/member"
    },

    notification : {
        idLength : 24,
        limit : 5
    }
}