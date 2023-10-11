module.exports = {
    ACCOUNT: {
        MAX_EMAIL_LENGTH: 60,
        MAX_PW_LENGTH: 60
    },

    AUTH: {
        CERTIFIED_LENGTH: 5,
        CERTIFIED_EXPIRE_TIME: 180,
    },

    CLUB: {
        MAX_CLUB_COVER_LENGTH: 500,
        MAX_CLUB_BELONG_LENGTH: 5,
        MAX_CLUB_BIG_CATEGORY_LENGTH: 5,
        MAX_CLUB_SMALL_CATEGORY_LENGTH: 5,
        MAX_BANNER_IMAGE_LENGTH: 20000,
        MAX_PROFILE_IMAGE_LENGTH: 20000,
        MAX_ALL_POST_COUNT_PER_PAGE: 20,
        MAX_POST_COUNT_PER_PAGE: 10,
        MAX_FIXED_NOTICE_COUNT_PER_PAGE: 5,
        MAX_BOARD_COUNT: 10
    },

    BOARD: {
        MAX_BOARD_LENGTH: 16
    },

    POST: {
        MAX_POST_TITLE_LENGTH: 32,
        MAX_POST_CONTENT_LENGTH: 500
    },

    IMAGE: {
        MAX_POST_COUNT: 3, // 30개
        MAX_PROMOTION_COUNT: 3, // 5개
        MAX_NOTICE_COUNT: 3 // 30개
    },

    POSITION: {
        PRESIDENT: 0,   // 회장
        MANAGER: 1,     // 운영진
        MEMBER: 2       // 부원
    },

    notificationUrl: {
        clubComment: "/comment",
        clubReply: "/reply",
        notiComment: "/notice/comment",
        notiReply: "/notice/reply",
        prComment: "/promotion/comment",
        prReply: "/promotion/reply",
        gradeUpdate: "/club/position",
        joinAccept: "/club/member"
    },

    notification: {
        idLength: 24,
        limit: 5
    }
}