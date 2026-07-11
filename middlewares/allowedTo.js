const appError = require("../utils/appError");

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return next(
        new appError("Unauthorized, user role not found", 401)
      );
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new appError(
          "Forbidden, You are not allowed to access this route",
          403,
        ),
      );
    }
    next();
  };
};

module.exports = allowedTo