const express = require('express');
const router = express.Router();

const { kakaoLogin, logout } = require('../controllers/authController');

router.post('/login/kakao', kakaoLogin);
router.post('/logout', logout);

module.exports = router;
