module.exports = {
    account: {
        MAX_EMAIL_LENGTH: 60,
        MAX_PW_LENGTH: 60
    },

    auth: {
        CERTIFIED_LENGTH: 5,
        CERTIFIED_EXPIRE_TIME: 180,
    },

    club: {
        MAX_CLUB_COVER_LENGTH: 500,
        MAX_CLUB_BELONG_LENGTH: 5,
        MAX_CLUB_BIG_CATEGORY_LENGTH: 5,
        MAX_CLUB_SMALL_CATEGORY_LENGTH: 5,
        MAX_BANNER_IMAGE_LENGTH: 20000,
        MAX_PROFILE_IMAGE_LENGTH: 20000,
        MAX_POST_COUNT_PER_PAGE: 10,
        MAX_FIXED_NOTICE_COUNT_PER_PAGE: 5
    },

    board: {
        MAX_BOARD_LENGTH: 16
    },

    position: {
        PERSIDENT: 0,   // 회장
        MANAGER: 1,     // 운영진
        MEMBER: 2       // 부원
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