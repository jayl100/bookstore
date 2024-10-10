const express = require("express");
const router = express.Router();

const {
    join,
    login,
    passwordResetRequest,
    passwordReset
}
    = require("../controllers/UserController");

router.use(express.json());


router.post("/join", join); // 회원가입
router.post("/login", login); // 로그인
router.post("/reset", passwordResetRequest); // 비밀번호 초기화 요청
router.put("/reset", passwordReset); // 비밀번호 초기화
module.exports = router;