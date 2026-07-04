require("dotenv").config();
module.exports = {
  port: process.env.PORT || 3001,
  mongoUrl: process.env.MONGO_URL_LOCAL,
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpire: "7d",
  theRateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      status: "fail",
      msg: "Too many requests from this IP, please try again later",
    },
  },
  nodeEnv: process.env.NODE_ENV || "development",
};

