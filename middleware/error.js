// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 记录错误
  console.error(err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose 错误处理
  // 无效ID错误
  if (err.name === 'CastError') {
    const message = '资源不存在';
    error = { message, statusCode: 404 };
  }

  // 重复字段错误
  if (err.code === 11000) {
    const message = '此字段值已存在，请使用不同的值';
    error = { message, statusCode: 400 };
  }

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // 返回错误响应
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || '服务器错误'
  });
};

module.exports = errorHandler; 