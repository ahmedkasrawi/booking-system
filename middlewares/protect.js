module.exports = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ msg: "Unauthorized, user role not found" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Forbidden, You are not allowed to access this route" });
  }

  next();
};
