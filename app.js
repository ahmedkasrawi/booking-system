const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const config = require("./config/index");
const usersRouter = require("./routers/users.route");
const servicesRouter = require("./routers/services.route");
const bookingsRouter = require("./routers/bookings.route");
const logger = require("./utils/logger");
const sanitize = require("mongo-sanitize");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
  // تنظيف الـ body والـ params بشكل طبيعي
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);

  // تنظيف الـ query بأمان بدون تغيير مرجع الكائن (تجنب خطأ الـ Getter)
  if (req.query) {
    const cleanQuery = sanitize(req.query);
    for (const key in req.query) {
      delete req.query[key]; // حذف المفاتيح القديمة
    }
    Object.assign(req.query, cleanQuery); // نسخ البيانات المطهّرة داخل الكائن الأصلي
  }

  next();
});

app.use(hpp());

const limiter = rateLimit(config.theRateLimit);
app.use("/api", limiter);

app.use("/api/auth", usersRouter);
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
// route not found
app.use((req, res) => {
  res.status(404).json({ status: "fail", msg: "Route not found" });
});
// global error handler
app.use((err, req, res, next) => {
  if (err.isOperational) {
    logger.warn(
      `[${err.statusCode || 500}] ${err.message} | URL: ${req.originalUrl}`,
    );
  } else {
    logger.error(`[500] ${err.message} | URL: ${req.originalUrl}`, {
      stack: err.stack,
    });
  }
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    msg: err.message,
    stack: config.nodeEnv === "development" ? err.stack : undefined,
  });
});

module.exports = app;
