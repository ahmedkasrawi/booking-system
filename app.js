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
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
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
    logger.warn(`[${statusCode}] ${err.message} | URL: ${req.originalUrl}`);
  }else {
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