const express = require('express');
const router = express.Router();

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, getUserInfo);
router.patch('/', verifyToken, updateUserInfo);

module.exports = router;
