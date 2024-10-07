const conn = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const addToCart = (req, res) => {
    let { book_id, quantity, user_id } = req.body;

    let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
    let values = [book_id, quantity, user_id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

const getCartItems = (req, res) => {
    let { user_id, selected } = req.body; // selected = [1, 3]

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems 
                LEFT JOIN books
                ON books.id = cartItems.book_id
                WHERE user_id = ?
                AND cartItems.id IN (?)`;
    let values = [user_id, selected];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

const removeCartItem = (req, res) => {
    let { id } = req.params;

    let sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql, id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

module.exports = { addToCart, getCartItems, removeCartItem };
