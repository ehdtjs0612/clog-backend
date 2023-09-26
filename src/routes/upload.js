const router = require("express").Router();
const loginAuth = require("../middleware/loginAuth");

// 동아리 프로필 이미지 업로드
router.post("/club-profile", loginAuth, async (req, res, next) => {

});

// 동아리 배너 이미지 업로드
router.post("/club-banner", async (req, res, next) => {

});

// 동아리 게시글 이미지 업로드
router.post("/post", async (req, res, next) => {

});

// 동아리 홍보물 이미지 업로드
router.post("/promotion", async (req, res, next) => {

});

// 동아리 공지글 이미지 업로드
router.post("/notice", async (req, res, next) => {

});

module.exports = router;
