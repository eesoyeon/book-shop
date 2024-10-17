// const conn = require('../mariadb'); // db 모듈
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

// 주문하기
const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true,
    });

    let {
        items,
        delivery,
        total_quantity,
        total_price,
        user_id,
        first_book_title,
    } = req.body;

    // 1. delivery (배송 정보 입력)
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;

    // 2. orders (주문하기)
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
    VALUES (?, ?, ?, ?, ?);`;
    values = [
        first_book_title,
        total_quantity,
        total_price,
        user_id,
        delivery_id,
    ];
    [results] = await conn.execute(sql, values); // insert
    let order_id = results.insertId;

    // items를 가지고, 장바구니에서 book_id, quantity 조회
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql, [items]); // select

    // 3. orderedBook
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
    values = [];
    orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });

    // let test = await conn.query(sql, [values]);
    // console.log(test);
    results = await conn.execute(sql, [values]); // insert

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result);
};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;

    let result = await conn.execute(sql, [items]);
    return result;
};

// 주문 목록 조회하기
const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true,
    });

    let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price 
    FROM orders LEFT JOIN delivery
    ON orders.delivery_id = delivery_id`;

    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);
};

// 주문 상세 정보 조회하기
const getOrderDetail = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true,
    });

    let { id } = req.params;
    let sql = `SELECT book_id, title, author, price, quantity FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id = ?`;

    let [rows, fields] = await conn.query(sql, id); // [id] ?
    return res.status(StatusCodes.OK).json(rows);
};

module.exports = { order, getOrders, getOrderDetail };
