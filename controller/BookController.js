const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const allBooks = (req, res) => {
    let {category_id, newly, limit, currentPage} = req.query;

    // limit : page 당 도서 수 (8개)
    // currentPage : 현재 페이지
    // offset : 1페이지 = 0, 2페이지 = 8, 3페이지 = 16... => limit * (currentPage-1)

    let offset = limit * (currentPage - 1);
    let sql = `SELECT *, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes  FROM books`;
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
    let {user_id} = req.body;
    let book_id = req.params.id;

    let sql = `SELECT *, 
(SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
(SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ? )) 
AS liked_book_id FROM books 
LEFT JOIN category ON books.category_id = category.category_id 
WHERE books.id = ?`;
    let values = [user_id, book_id, book_id];
    conn.query(sql, values, (err, result) => {
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