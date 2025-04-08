const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 验证用户是否已登录
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // 从请求头获取令牌
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // 从cookies获取令牌
    token = req.cookies.token;
  }

  // 检查令牌是否存在
  if (!token) {
    return res.status(401).json({
      success: false,
      error: '未授权访问'
    });
  }

  try {
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 查找用户
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '找不到关联此令牌的用户'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: '未授权，令牌无效'
    });
  }
};

// 授权特定角色的用户
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '未授权访问'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: '您没有权限访问此资源'
      });
    }
    next();
  };
}; 