const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请输入文档标题'],
    trim: true,
    maxlength: [100, '标题不能超过100个字符']
  },
  content: {
    type: String,
    required: [true, '文档内容不能为空']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  productInfo: {
    productName: {
      type: String,
      required: [true, '请输入产品名称'],
      trim: true
    },
    coreFunctions: {
      type: String,
      required: [true, '请描述产品的核心功能']
    },
    targetUsers: {
      type: String,
      required: [true, '请描述目标用户']
    },
    visualReference: String,
    additionalNotes: String
  },
  documentType: {
    type: String,
    enum: ['technical', 'marketing', 'user_guide', 'api_doc', 'other'],
    default: 'technical'
  },
  language: {
    type: String,
    enum: ['zh_CN', 'en_US'],
    default: 'zh_CN'
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'published'],
    default: 'draft'
  },
  format: {
    type: String,
    enum: ['markdown', 'html', 'pdf', 'docx'],
    default: 'markdown'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新updatedAt时间戳
DocumentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Document', DocumentSchema); 