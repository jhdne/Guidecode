const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  updateUserLevel
} = require('../controllers/users');

const router = express.Router();

// 引入身份验证和授权中间件
const { protect, authorize } = require('../middleware/auth');

// 所有路由都需要身份验证
router.use(protect);

// 用户资料相关路由
router.put('/profile', updateProfile);

// 仅限管理员路由
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);
router.put('/:id/level', authorize('admin'), updateUserLevel);

module.exports = router; 