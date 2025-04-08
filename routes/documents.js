const express = require('express');
const {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  generateDocument
} = require('../controllers/documents');

const router = express.Router();

// 引入身份验证中间件
const { protect } = require('../middleware/auth');

// 所有路由都需要身份验证
router.use(protect);

// 文档路由
router.route('/')
  .post(createDocument)
  .get(getDocuments);

router.route('/:id')
  .get(getDocument)
  .put(updateDocument)
  .delete(deleteDocument);

router.post('/:id/generate', generateDocument);

module.exports = router; 