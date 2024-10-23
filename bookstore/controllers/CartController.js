const ensureAuthorization = require("../auth");
const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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
    } else if (authorization instanceof jwt.JsonWebTokenError) {

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
    } else if (authorization instanceof jwt.JsonWebTokenError) {

        return res.status(StatusCodes.BAD_REQUEST).json({
            'message': 'Wrong token used, try again later',
        })
    } else {
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id = ?`;
        let values = [authorization.id, selected];

        if (selected) { // 주문서 작성 시 선택한 장바무니 목록 조회
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

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
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            'message': 'Token expired, try again later',
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {

        return res.status(StatusCodes.BAD_REQUEST).json({
            'message': 'Wrong token used, try again later',
        })
    } else {
        const cartItemId = req.params.id; //cartItemId

        let sql = "DELETE FROM cartItems WHERE id = ?";

        conn.query(sql, cartItemId, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(result);
        })
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeFromCart
}


