const conn = require("../mariadb");
const {StatusCode, StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {TokenExpiredError} = require("jsonwebtoken");

dotenv.config();

const addLike = (req, res) => {
    const book_id = req.params.id;

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            'message': 'Token expired, try again later',
        });
    } else if (authorization instanceof TokenExpiredError) {

        return res.status(StatusCodes.BAD_REQUEST).json({
            'message': 'Wrong token used, try again later',
        })
    } else {
        let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
        let values = [authorization.id, book_id];
        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(result);
        })
    }
};

const removeLike = (req, res) => {
    const book_id = req.params.id;

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            'message': 'Token expired, try again later',
        });
    } else if (authorization instanceof TokenExpiredError) {

        return res.status(StatusCodes.BAD_REQUEST).json({
            'message': 'Wrong token used, try again later',
        })
    } else {
        let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
        let values = [authorization.id, book_id];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(result);
    })
    }
};

function ensureAuthorization(req, res) {

    try {
        let receivedJWT = req.headers['authorization'];
        console.log("receivedJWT : ", receivedJWT);

        let decodedJWT = jwt.verify(receivedJWT, process.env.JWT_SECRET);
        console.log(decodedJWT);

        return decodedJWT;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = {
    addLike,
    removeLike
};