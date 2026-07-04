const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(
      new appError("Unauthorized, token not provided", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return next(
      new appError("Invalid or expired token", 401)
    );
  }
};
