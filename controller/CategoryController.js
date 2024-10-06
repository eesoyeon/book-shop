const conn = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const allCategory = (req, res) => {
    let sql = `SELECT * FROM category`;
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

module.exports = {
    allCategory,
};
