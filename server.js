require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/index");
const logger = require("./utils/logger");

if (!config.mongoUrl) {
  logger.error("MONGO_URL is required");
  process.exit(1);
}

const start = async () => {
  try {
    await mongoose.connect(config.mongoUrl, {
      dbName: "booking_system",
      autoIndex: true,
    });
    logger.info("Connected to MongoDB");
    app.listen(config.port, () =>
      logger.info(`Server running on port ${config.port}`),
    );
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`, {
      stack: err.stack,
    });
    process.exit(1);
  }
};

start();

// التقاط أي خطأ Asynchronous خارج الـ Express
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  // نغلق السيرفر بأمان ثم نوقف الـ Process
  process.exit(1);
});

// التقاط أي خطأ Synchronous مفاجئ (مثل كتابة اسم متغير غير موجود)
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.name} | ${err.message}`);
  process.exit(1);
});