const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { setupLogging } = require('./config/logger');
const errorHandler = require('./middleware/error');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 初始化Express应用
const app = express();

// 设置日志记录
setupLogging();

// 中间件
app.use(cors());
app.use(express.json());

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/documents', require('./routes/documents'));

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Guidecode API 运行中' });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器在端口 ${PORT} 上运行...`);
});

// 处理未捕获的异常
process.on('unhandledRejection', (err) => {
  console.log('未处理的异常: ', err.message);
  // 关闭服务器并退出进程
  // server.close(() => process.exit(1));
}); 