const conn = require("../mariadb");
const {StatusCode, StatusCodes} = require("http-status-codes");


const addLike = (req, res) => {

    const {id} = req.params;
    const {user_id} = req.body;

    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
    let values = [user_id, id];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(result);
    })
};

const removeLike = (req, res) => {

    const {id} = req.params;
    const {user_id} = req.body;

    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
    let values = [user_id, id];

    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(result);
    })
};

module.exports = {
    addLike,
    removeLike
};