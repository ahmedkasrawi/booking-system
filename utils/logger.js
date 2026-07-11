const winston = require("winston");
const config = require("../config/index");

// 🛡️ دالة مخصصة لتطهير الرسائل عالمياً من محاولات الـ Log Injection
const sanitizeLogFormat = winston.format((info) => {
  if (typeof info.message === "string") {
    // استبدال أي رمز سطر جديد بشرطة سفلية لمنع تزوير السطور
    info.message = info.message.replace(/[\r\n]/g, "_");
  }
  return info;
});

// 1. تحديد شكل التغليف (الملفات)
const customFormat = winston.format.combine(
  sanitizeLogFormat(), // 👈 إضافته هنا لتأمين الملفات أولاً
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // إضافة الوقت
  winston.format.errors({ stack: true }), // طباعة تفاصيل الخطأ (رقم السطر والملف)
  winston.format.json(), // تحويل السجل لـ JSON
);

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
        sanitizeLogFormat(), // 👈 إضافته هنا لتأمين شاشة الترمينال في بيئة التطوير
        winston.format.colorize(), // تلوين النصوص
        winston.format.simple(), // شكل بسيط للعين البشرية
      ),
    }),
  );
}

module.exports = logger;
