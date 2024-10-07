const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // 암호화 담당

const dotenv = require("dotenv");
dotenv.config();


const join = (req, res) => {
    const {email, password} = req.body;
    let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';

    // 비밀번호 암호화
    const salt = crypto.randomBytes(32).toString("base64");
    // randomBytes 64만큼의 길이로 byte를 변환하고 문자열로 바꾼다. 그것을 salt에 담는다.
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha512").toString("base64");
    // 10000 : 해시함수를 반복하는 횟수
    // ex. 8y9ne/gEbQm2E/XmUtC8jJKoQU3bL/Grat1P7VGVC+NoRKmoe7PQV0lkdTpLIzq0dHLLU1preS1R9BJJu8zklg==
    // 회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와, salt 값을 같이 저장 ==> sql values에 hashPassword로 저장.
    // 로그인 시, 이메일 & 비밀번호의 값을 => salt 값으로 꺼내서 비밀번호 암호화 하고 => 디비 비밀번호랑 비교.

    let values = [email, hashPassword, salt];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
        }
        res.status(StatusCodes.CREATED).json(result);
    })
};

const login = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    let values = [email];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const loginUser = result[0];
        // 비밀번화와 salt의 값을 비교해야 함.
        const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 32, "sha512").toString("base64");

        // 디비 비밀번호와 비교
        if (loginUser && loginUser.password === hashPassword) {
            // 토큰 발행
            const token = jwt.sign({
                email : loginUser.email,
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE,
                issuer: process.env.JWT_ISSUER,
            });

            // 토큰 쿠키에 담기
            res.cookie('token', token, { httpOnly: true });
            console.log(token); // 확인용

            res.status(StatusCodes.OK).json(result);
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Unauthorized user',
            }); // 401 : Unauthorized 인증 실패, 403 : forbidden 접근금지
        }
    })
};

const passwordResetRequest = (req, res) => {
    const {email} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    let values = [email];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const user = result[0];
        if (user) {
            return res.status(StatusCodes.OK).json({
                email : email,
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }

    })
};

const passwordReset = (req, res) => {
    const {email, password} = req.body;

    let sql = 'UPDATE users SET password = ?, salt = ? WHERE email = ?;';

    const salt = crypto.randomBytes(32).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha512").toString("base64");

    let values = [hashPassword, salt, email];
    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(result.affectedRows === 0) {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        } else {
        return res.status(StatusCodes.OK).json(result);
        }
    })
};




module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};