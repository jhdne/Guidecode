const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: '请提供用户名、邮箱和密码'
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '用户名或邮箱已被注册'
      });
    }

    // 验证密码强度
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: '密码必须至少包含8个字符，包括一个大写字母、一个小写字母和一个数字'
      });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
    });

    // 生成令牌并发送响应
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: '请提供邮箱和密码'
      });
    }

    // 查找用户并包含密码字段
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: '无效的凭据'
      });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: '无效的凭据'
      });
    }

    // 生成令牌并发送响应
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    获取当前登录用户
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    用户登出
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// 生成令牌并发送响应的辅助函数
const sendTokenResponse = (user, statusCode, res) => {
  // 创建令牌
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // 在生产环境中使用secure cookies
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}; 