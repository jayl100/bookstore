const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const allBooks = (req, res) => {
    let {category_id, newly, limit, currentPage} = req.query;

    // limit : page 당 도서 수 (8개)
    // currentPage : 현재 페이지
    // offset : 1페이지 = 0, 2페이지 = 8, 3페이지 = 16... => limit * (currentPage-1)

    let offset = limit * (currentPage - 1);
    let sql = `SELECT * FROM books`;
    let values = [];
    if (category_id && newly) {
        sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = [category_id];
    } else if (category_id) {
        sql += ` WHERE category_id = ?`;
        values = [category_id];
    } else if (newly) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), offset);


    conn.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (result.length) {
            return res.status(StatusCodes.OK).json(result);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })

};

const bookDetail = (req, res) => {
    let {id} = req.params;
    id = parseInt(id);

    let sql = `SELECT * FROM books LEFT JOIN category
                ON books.category_id = category.id WHERE books.id = ?`;
    conn.query(sql, id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (result[0]) {
            return res.status(StatusCodes.OK).json(result[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })

};

module.exports = {
    allBooks,
    bookDetail
}