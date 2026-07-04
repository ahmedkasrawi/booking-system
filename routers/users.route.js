const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const protect = require("../middlewares/protect");

const {
  getAllUsers,
  registerUser,
  loginUser,
} = require("../controllers/users.controller");

router.get("/users", verifyToken, protect, getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
