const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

// 모듈화 => 하나의 미들웨어 역할
const validate = (req, res, next) => {
    const err = validationResult(req);

    // 밥 안드셨나요? 아니요 => 이중부정 = 긍정
    // 밥 드셨나요? 네 => 긍정
    if (err.isEmpty()) {
        return next(); // 다음 할 일 (미들웨어, 함수) 찾아가
    } else {
        return res.status(400).json(err.array());
    }
};

// 회원가입
router.post('/join', (req, res) => {
    res.json('회원가입');
});

// 로그인
router.post('/login', (req, res) => {
    res.json('로그인');
});

// 비밀번호 초기화 요청
router.post('/reset', (req, res) => {
    res.json('비밀번호 초기화 요청');
});

// 비밀번호 초기화
router.put('/reset', (req, res) => {
    res.json('비밀번호 초기화');
});

module.exports = router;
