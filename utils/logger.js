const winston = require("winston");
const config = require("../config/index");
// 1. تحديد شكل التغليف
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // إضافة الوقت
  winston.format.errors({ stack: true }), // طباعة تفاصيل الخطأ (رقم السطر والملف)
  winston.format.json(), // تحويل السجل لـ JSON
);
// format: winston.format.json()

const logger = winston.createLogger({
  level: "info", // الحد الأدنى للأهمية
  format: customFormat,
  transports: [
    // 3. الشحن للملفات (Transports)
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (config.nodeEnv !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // تلوين النصوص
        winston.format.simple(), // شكل بسيط للعين البشرية
      ),
    }),
  );
}

module.exports = logger;