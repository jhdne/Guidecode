# Guidecode - AI辅助的文档生成平台

Guidecode是一个基于AI的文档生成平台，帮助用户快速创建高质量的产品文档、技术文档和用户指南。

## 功能特性

- 智能文档生成：基于用户提供的产品信息，自动生成高质量文档
- 多级用户权限：基础、高级和专业三种用户等级，不同的文档生成限制
- 多语言支持：支持中文和英文界面切换，以及生成多语言文档
- 安全的用户认证：JWT认证，密码加密存储
- 响应式设计：适配不同设备屏幕

## 技术栈

### 前端
- React.js
- React Router
- Ant Design
- Axios
- i18next (国际化)

### 后端
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT认证
- bcrypt密码加密

## 快速开始

### 先决条件
- Node.js (v14+)
- MongoDB

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/guidecode.git
cd guidecode
```

2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

3. 配置环境变量
创建`.env`文件并配置以下环境变量:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/guidecode
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

4. 运行应用
```bash
# 同时运行前端和后端（开发模式）
npm run dev:full

# 仅运行后端
npm run dev

# 仅运行前端
npm run client
```

5. 打开浏览器访问 http://localhost:3000

## 项目结构

```
guidecode/
├── client/                 # 前端React应用
│   ├── public/             # 静态文件
│   └── src/                # 源代码
│       ├── components/     # 公共组件
│       ├── contexts/       # 上下文（如Auth上下文）
│       ├── pages/          # 页面组件
│       └── utils/          # 工具函数和API服务
├── config/                 # 配置文件
├── controllers/            # API控制器
├── middleware/             # Express中间件
├── models/                 # Mongoose模型
├── routes/                 # API路由
└── logs/                   # 日志文件
```

## API文档

### 认证API
- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前登录用户信息
- `GET /api/auth/logout` - 用户登出

### 用户API
- `GET /api/users` - 获取所有用户（仅限管理员）
- `GET /api/users/:id` - 获取单个用户（仅限管理员）
- `PUT /api/users/profile` - 更新当前用户资料
- `PUT /api/users/:id/level` - 更新用户等级（仅限管理员）

### 文档API
- `POST /api/documents` - 创建新文档
- `GET /api/documents` - 获取当前用户的所有文档
- `GET /api/documents/:id` - 获取单个文档
- `PUT /api/documents/:id` - 更新文档
- `DELETE /api/documents/:id` - 删除文档
- `POST /api/documents/:id/generate` - 生成文档内容

## 贡献

欢迎贡献代码、报告Bug或提出新功能建议。

## 许可证

MIT 