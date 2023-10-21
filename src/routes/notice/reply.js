// const loginAuth = require('../../middleware/auth/loginAuth');
// const validate = require('../../module/validation');

// const router = require("express").Router();

// // 게시글의 답글 리스트 조회
// // 권한: 로그인한 유저
// router.get("/list/comment/:commentId", loginAuth, async (req, res, next) => {
//     const userId = req.decoded.id;
//     const { commentId } = req.params;
//     const page = req.query.page || 1;
//     const result = {
//         message: "",
//         data: {}
//     };

//     try {
//         validate(commentId, "comment-id").checkInput().isNumber();

//         const selectReplySql = `SELECT
//                                     notice_reply_tb.id,
//                                     account_tb.re`
//     } catch (error) {
//         return next(error);
//     }
//     res.send(result);
// });

// module.exports = router;
