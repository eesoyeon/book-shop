const conn = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

// (카테고리별, 신간 여부) 전체 도서 목록 조회
const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;

    // limit: page 당 도서 수     : 3
    // currentPage: 현채 몇 페이지 : 1, 2, 3
    // offset:                  : 0, 3, 6, 9, ...
    // offset = limit * (currentPage-1)
    let offset = limit * (currentPage - 1);

    let sql = `SELECT * FROM books`;
    let values = [];

    if (category_id && news) {
        sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values.push(category_id);
    } else if (category_id) {
        sql += ` WHERE category_id = ?`;
        values.push(category_id);
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), offset);

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.length) return res.status(StatusCodes.OK).json(results);
        else return res.status(StatusCodes.NOT_FOUND).end();
    });
};

const bookDetail = (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let sql = `SELECT * FROM Bookshop.books 
LEFT JOIN category ON books.category_id = category.id
WHERE books.id = ?;`;
    conn.query(sql, id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const book = results[0];
        if (book) return res.status(StatusCodes.OK).json(results[0]);
        else return res.status(StatusCodes.NOT_FOUND).end();
    });
};

// const booksByCategory = (req, res) => {
//     let { category_id } = req.query;

//     let sql = `SELECT * FROM books WHERE category_id = ?`;
//     conn.query(sql, category_id, (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.status(StatusCodes.BAD_REQUEST).end();
//         }

//         if (results.length) return res.status(StatusCodes.OK).json(results);
//         else return res.status(StatusCodes.NOT_FOUND).end();
//     });
// };

module.exports = {
    allBooks,
    bookDetail,
};
