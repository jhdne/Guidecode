const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/auth');

const router = express.Router();

// 引入身份验证中间件
const { protect } = require('../middleware/auth');

// 注册和登录路由（公开）
router.post('/register', register);
router.post('/login', login);

// 需要身份验证的路由
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router; 