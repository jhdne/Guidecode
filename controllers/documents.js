const Document = require('../models/Document');
const User = require('../models/User');

// @desc    创建文档
// @route   POST /api/documents
// @access  Private
exports.createDocument = async (req, res, next) => {
  try {
    // 检查用户是否超过文档限制
    const user = await User.findById(req.user.id);
    
    if (user.documentsCreated >= user.documentsLimit) {
      return res.status(403).json({
        success: false,
        error: '您已达到当前用户等级的文档创建限制，请升级您的账户'
      });
    }

    // 将用户ID添加到请求体
    req.body.user = req.user.id;
    
    // 创建文档
    const document = await Document.create(req.body);
    
    // 更新用户的文档创建计数
    user.documentsCreated += 1;
    await user.save();

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取所有文档
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    let query;

    // 针对普通用户，只返回他们自己的文档
    if (req.user.role !== 'admin') {
      query = Document.find({ user: req.user.id });
    } else {
      // 管理员可以看到所有文档
      query = Document.find();
    }

    // 执行查询
    const documents = await query;

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取单个文档
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: '找不到该文档'
      });
    }

    // 确保用户是文档的所有者或管理员
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限访问此文档'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新文档
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res, next) => {
  try {
    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: '找不到该文档'
      });
    }

    // 确保用户是文档的所有者或管理员
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限更新此文档'
      });
    }

    // 更新文档
    document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    删除文档
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: '找不到该文档'
      });
    }

    // 确保用户是文档的所有者或管理员
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限删除此文档'
      });
    }

    await document.remove();

    // 如果用户删除了文档，减少他们的文档计数
    if (document.user.toString() === req.user.id) {
      const user = await User.findById(req.user.id);
      user.documentsCreated = Math.max(0, user.documentsCreated - 1);
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    生成文档内容
// @route   POST /api/documents/:id/generate
// @access  Private
exports.generateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: '找不到该文档'
      });
    }

    // 确保用户是文档的所有者或管理员
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限生成此文档'
      });
    }

    // 这里将来会添加AI文档生成的调用
    // TODO: 集成大型语言模型API来生成文档内容

    // 暂时使用模拟生成的内容
    const generatedContent = `# ${document.title}\n\n## 简介\n这是一个关于${document.productInfo.productName}的自动生成文档。\n\n## 核心功能\n${document.productInfo.coreFunctions}\n\n## 目标用户\n${document.productInfo.targetUsers}`;

    // 更新文档
    document.content = generatedContent;
    document.status = 'generated';
    await document.save();

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
}; 