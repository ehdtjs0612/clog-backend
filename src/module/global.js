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
        maxPostCountPerPage: 10
    },

    position: {
        president: 0,
        manager: 1,
        member: 2
    }
}