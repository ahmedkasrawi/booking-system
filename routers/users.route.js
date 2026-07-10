const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowedTo");
const { registerSchema, loginSchema } = require("../validators/userValidator");
const validate = require("../middlewares/validateMiddleware")
const {
  getAllUsers,
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/users.controller");

router.get("/users", verifyToken, allowTo("admin"), getAllUsers);
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", verifyToken, getMe);

module.exports = router;
