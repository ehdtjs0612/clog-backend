const pool = require("../../config/database/postgresql");
const router = require("express").Router();
const validate = require("../module/validation");
const bcryptUtil = require("../module/bcrypt");
const { BadRequestException } = require("../module/customError");
const personalColor = require("../module/personalColor");
const loginAuth = require("../middleware/loginAuth");

// 회원가입
router.post("/", async (req, res, next) => {
    const { email, pw, name, major, entryYear } = req.body;
    const result = {
        message: "",
        data: {}
    }

    try {
        validate(email, "email").checkInput().checkEmailRegex();
        validate(pw, "pw").checkInput().checkPwRegex();
        validate(name, "name").checkInput().checkNameRegex();
        validate(major, "major").checkInput().isNumber();
        validate(entryYear, "entryYear").checkInput().isNumber();

        // 비밀번호 암호화
        const hashedPassword = await bcryptUtil.hashing(pw);

        const sql = `INSERT INTO 
                        account_TB (major, email, pw, name, entry_year, personal_color)
                        VALUES ($1, $2, $3, $4, $5, $6)`;

        const params = [major, email, hashedPassword, name, entryYear, personalColor()];
        const data = await pool.query(sql, params);
        if (data.rowCount !== 0) {
            result.message = "회원가입 성공";
        }

        res.send(result);

    } catch (error) {
        if (error.code === '23505' && error.constraint === 'unique_email') {
            return next(new BadRequestException("중복된 이메일이 존재합니다"));
        }
        next(error);
    }
});

// 프로필 조회
router.get("/", loginAuth, async (req, res, next) => {
    const result = {
        message: "" | null,
        data: {}
    }

    try {
        const sql = `SELECT name, personal_color AS "personalColor", major, entry_year AS "entryYear", created_at AS "createdAt" from account_tb WHERE id = $1`;
        const params = [req.decoded.id];
        const data = await pool.query(sql, params);

        if (data.rowCount !== 0) {
            result.message = "프로필 조회 성공";
            result.data = data.rows[0]
        }
        console.log(result)
        res.send(result);
    } catch (error) {
        next(error);
    }
});

// 계정정보 수정
router.put("/", loginAuth, async (req, res, next) => {
    const { name, entryYear, major } = req.body;
    const result = {
        message: "" | null,
        data: {}
    }

    try {
        validate(name, "name").checkInput().checkNameRegex();
        validate(major, "major").checkInput().isNumber();
        validate(entryYear, "entryYear").checkInput().isNumber();

        const sql = `UPDATE account_tb SET name = $1, "entry_year" = $2, major = $3 WHERE id = $4`;
        const params = [name, entryYear, major, req.decoded.id];
        const data = await pool.query(sql, params);

        if (data.rowCount =! 0) {
            result.message = "계정정보 수정 성공";
            result.data = data.rows[0]
        }

        res.send(result)
    } catch (error) {
        next(error)
    }
});

// 회원 탈퇴
router.delete("/", loginAuth, async (req, res, next) => {
    const result = {
        message: "" | null,
        data: {}
    }

    try {
        const sql = `DELETE FROM account_tb WHERE id = $1`;
        const params = [req.decoded.id];
        const data = await pool.query(sql, params);

        if (data.rowCount !== 0) {
            result.message = "계정 삭제 성공";
            result.data = data.rows[0]
        }

        res.send(result);
    } catch (error) {
        next(error);
    }
});

// 비밀번호 재설정
router.put("/pw", async (req, res, next) => {
    const { email, newPw } = req.body
    const result = {
        message: "" | null,
        data: {}
    };

    try {
        validate(email, "email").checkInput().checkEmailRegex();
        validate(newPw, "newPw").checkInput().checkPwRegex();

        const hashedPassword = await bcryptUtil.hashing(newPw);

        const sql = `UPDATE account_tb SET pw = $1 WHERE email = $2 `;
        const params = [hashedPassword, email];
        const data = await pool.query(sql, params);

        if (data.rowCount !== 0) {
            result.message = "비밀번호 재설정 완료";
            result.data = data.rows[0]
        }

        res.send(result);
    } catch (error) {
        next(error);
    }
});

// 비밀번호 재설정 (로그인 한 상태에서)
router.put("/loged-in/pw", loginAuth, async (req, res, next) => {
    const { newPw } = req.body
    const result = {
        message: "" | null,
        data: {}
    };

    try {
        validate(newPw, "newPw").checkInput().checkPwRegex();

        const hashedPassword = await bcryptUtil.hashing(newPw);

        const sql = `UPDATE account_tb SET pw = $1 WHERE id = $2 `;
        const params = [hashedPassword, req.decoded.id];
        const data = await pool.query(sql, params);

        if (data.rowCount !== 0) {
            result.message = "비밀번호 재설정 완료";
            result.data = data.rows[0]
        }

        res.send(result);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
