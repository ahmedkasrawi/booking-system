const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/index")

const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpire,
  });
};

module.exports = {
  generateToken,
};
