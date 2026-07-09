const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowedTo");

const {
  getAllUsers,
  registerUser,
  loginUser,
} = require("../controllers/users.controller");

router.get("/users", verifyToken, allowTo("admin"), getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
