const winston = require('winston');
const path = require('path');

// 日志记录器配置
const setupLogging = () => {
  // 创建日志格式
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

  // 创建日志记录器
  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: logFormat,
    transports: [
      // 控制台输出
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          logFormat
        )
      }),
      // 错误日志文件
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error'
      }),
      // 所有日志文件
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/combined.log')
      })
    ]
  });

  // 替换全局console对象
  console.log = (...args) => logger.info(args.join(' '));
  console.info = (...args) => logger.info(args.join(' '));
  console.warn = (...args) => logger.warn(args.join(' '));
  console.error = (...args) => logger.error(args.join(' '));
  console.debug = (...args) => logger.debug(args.join(' '));

  return logger;
};

module.exports = { setupLogging }; 