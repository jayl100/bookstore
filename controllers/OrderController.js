const conn = require("../mariadb");
const {StatusCodes} = require('http-status-codes');

const order = (req, res) => {
    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;

    let delivery_id = 3
    let order_id = 2
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    //
    // conn.query(sql, values, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(StatusCodes.BAD_REQUEST).end();
    //     }
    //
    //     delivery_id = result.insertId;
    //
    //     return res.status(StatusCodes.OK).json(result);
    // })

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

    // conn.query(sql, values, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(StatusCodes.BAD_REQUEST).end();
    //     }
    //
    //     order_id = result.insertId;
    //
    //     return res.status(StatusCodes.OK).json(result);
    // })

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    items.forEach(item => {
    values.push([order_id, item.book_id, item.quantity])
    })

    conn.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(result);
    })

};

const getOrder = (req, res) => {
};

const getOrderDetails = (req, res) => {
};

module.exports = {
    order,
    getOrder,
    getOrderDetails,
}