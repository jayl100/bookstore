const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const res = require("express/lib/response");
const {TokenExpiredError} = require("jsonwebtoken");
dotenv.config();

// 장바구니 담기
const addToCart = (req, res) => {

    const {book_id, quantity} = req.body;

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
    let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        let values = [book_id, quantity, authorization.id];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(result);
    })
    }
};

// 장바구니 아이템 목록 조회
const getCartItems = (req, res) => {

    const {selected} = req.body;

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
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id = ? AND cartItems.id IN (?)`;
        let values = [authorization.id, selected];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(result);
        })
    }
}

// 장바구니 삭제
const removeFromCart = (req, res) => {

    const cartItemId = req.params.id; //cartItemId

    let sql = "DELETE FROM cartItems WHERE id = ?";

    conn.query(sql, cartItemId, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(result);
    })}

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
    addToCart,
    getCartItems,
    removeFromCart
}


