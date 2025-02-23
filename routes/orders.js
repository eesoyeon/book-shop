const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');
const {
    order,
    getOrders,
    getOrderDetail,
} = require('../controller/OrderController');

router.use(express.json());

router.post('/', order); // 주문하기
router.get('/', getOrders); // 주문 목록 조회
router.get('/:id', getOrderDetail); // 주문 상세 상품 조회

module.exports = router;
