const User = require('../models/User');

// @desc    获取所有用户
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取单个用户
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '找不到该用户'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新用户资料
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // 获取要更新的字段
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email
    };

    // 从请求中删除未定义的字段
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // 确保存在要更新的字段
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        error: '请提供至少一个要更新的字段'
      });
    }

    // 更新用户
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '找不到该用户'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新用户等级
// @route   PUT /api/users/:id/level
// @access  Private/Admin
exports.updateUserLevel = async (req, res, next) => {
  try {
    const { userLevel } = req.body;

    // 验证用户等级是否有效
    if (!['basic', 'premium', 'pro'].includes(userLevel)) {
      return res.status(400).json({
        success: false,
        error: '无效的用户等级'
      });
    }

    // 查找并更新用户
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '找不到该用户'
      });
    }

    user.userLevel = userLevel;
    user.updateDocumentsLimit();
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}; 