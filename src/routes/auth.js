const pool = require("../../config/database/postgresql");
const router = require("express").Router();
const validate = require("../module/validation");
const { maxEmailLength, maxPwLength } = require("../module/global");
const bcryptUtil = require("../module/bcrypt");
const jwtUtil = require("../module/jwt");
const { BadRequestException } = require('../module/customError');
const emailHandler = require("../module/emailHandler");
const redisClient = require("../../config/database/redis");

router.post("/login", async (req, res, next) => {
    const { email, pw } = req.body;
    const result = {
        message: "",
        data: {}
    };

    try {
        validate(email, "email").checkInput().checkLength(1, maxEmailLength);
        validate(pw, "pw").checkInput().checkLength(1, maxPwLength);

        const sql = "SELECT id, pw FROM account_TB WHERE email = $1";
        const params = [email];
        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            const userData = data.rows[0];
            // 입력받은 pw와 암호화된 pw가 일치할경우 accessToken 발급
            const passwordMatch = await bcryptUtil.compare(pw, userData.pw);
            if (passwordMatch) {
                const accessToken = await jwtUtil.userSign(userData);
                res.cookie("accessToken", accessToken, {
                    httpOnly: false,
                    secure: false,
                });
                result.message = "로그인 성공";
                return res.send(result);
            }
        }
        throw new BadRequestException("아이디 또는 비밀번호가 올바르지 않습니다");

    } catch (error) {
        next(error);
    }
});

router.post("/logout", (req, res, next) => {
    const result = {
        message: "",
        data: {}
    }

    try {
        res.clearCookie("accessToken");
        return res.send(result);

    } catch (error) {
        next(error);
    }
});

router.get("/duplicate/email/:email", async (req, res, next) => {
    const result = {
        message: "",
        data: {}
    };
    const { email } = req.params;

    try {
        validate(email, "email").checkInput().checkEmailRegex();

        const sql = `SELECT id FROM account_tb WHERE email = $1`;
        const params = [email];
        const data = await pool.query(sql, params);

        // 중복된 이메일이 존재하는 경우
        if (data.rowCount !== 0) {
            throw new BadRequestException("중복된 이메일이 존재합니다");
        }
        result.message = "사용 가능한 이메일입니다";
        res.send(result);

    } catch (error) {
        next(error);
    }
});

router.post("/send-code", async (req, res, next) => {
    const { email } = req.body;
    const result = {
        message: "",
        data: {}
    }

    try {
        // validate(email, "email").checkInput().checkEmailRegex();
        emailHandler.sendVerifyEmail(email);

        result.message = "인증번호 전송 완료";
        res.send(result);
    } catch (error) {
        next(error);
    }
});

router.post("/signup/verify-email", async (req, res, next) => {
    const { email, code } = req.body;
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(email, "email").checkInput().checkEmailRegex();
        validate(code, "code").checkInput().isNumber().checkLength(5, 5);

        const data = await redisClient.get(email);
        // redis에 이메일이 존재하지 않는 경우
        if (!data) {
            throw new BadRequestException("인증번호를 요청한 이메일이 존재하지 않습니다");
        }
        // 인증번호가 유효하지 않은 경우
        if (data !== code) {
            throw new BadRequestException("인증번호가 올바르지 않습니다");
        }
        // 인증번호가 유효한 경우
        result.message = "인증이 완료되었습니다";
        await redisClient.del(email);
        return res.send(result);

    } catch (error) {
        next(error);
    }
});

router.post("/reset-pw/verify-email", async (req, res, next) => {
    const { email, code } = req.body;
    const result = {
        message: "",
        data: {}
    }

    try {
        // validate(email, "email").checkInput().checkEmailRegex();
        validate(code, "code").checkInput().isNumber().checkLength(5, 5);

        const savedVerifyCode = await redisClient.get(email);
        // redis에 이메일이 존재하지 않는 경우
        if (!savedVerifyCode) {
            throw new BadRequestException("인증번호를 요청한 이메일이 존재하지 않습니다");
        }
        // 인증번호가 유효하지 않은 경우
        if (savedVerifyCode !== code) {
            throw new BadRequestException("인증번호가 올바르지 않습니다");
        }
        // 인증번호가 유효한 경우 해당 이메일을 가진 유저를 조회
        const findUserSql = "SELECT id FROM account_tb WHERE email = $1";
        const params = [email];
        const userData = await pool.query(findUserSql, params);

        if (userData.rowCount === 0) {
            throw new BadRequestException("해당하는 사용자가 존재하지 않습니다");
        }
        const userPk = userData.rows[0].id;
        result.message = "인증이 완료되었습니다";
        result.data.userId = userPk;

        await redisClient.del(email);
        return res.send(result);

    } catch (error) {
        next(error);
    }
});

module.exports = router;
