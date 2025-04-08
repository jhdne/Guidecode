const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '请输入用户名'],
    unique: true,
    trim: true,
    minlength: [6, '用户名至少需要6个字符'],
    maxlength: [20, '用户名不能超过20个字符'],
    match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线']
  },
  email: {
    type: String,
    required: [true, '请输入邮箱'],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '请输入有效的邮箱地址'
    ]
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
    minlength: [8, '密码至少需要8个字符'],
    maxlength: [20, '密码不能超过20个字符'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  userLevel: {
    type: String,
    enum: ['basic', 'premium', 'pro'],
    default: 'basic'
  },
  documentsCreated: {
    type: Number,
    default: 0
  },
  documentsLimit: {
    type: Number,
    default: 5 // 基础用户每月可创建5个文档
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  googleId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 密码加密
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 签署JWT令牌
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// 校验用户输入的密码
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 根据用户等级更新文档限制
UserSchema.methods.updateDocumentsLimit = function() {
  switch (this.userLevel) {
    case 'basic':
      this.documentsLimit = 5;
      break;
    case 'premium':
      this.documentsLimit = 20;
      break;
    case 'pro':
      this.documentsLimit = 50;
      break;
    default:
      this.documentsLimit = 5;
  }
};

module.exports = mongoose.model('User', UserSchema); 