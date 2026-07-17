const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowedTo");
const { registerSchema, loginSchema } = require("../validators/userValidator");
const validate = require("../middlewares/validateMiddleware")
const { roles } = require("../constants/index");
const {
  registerUser,
  loginUser,
  getMe,
  userToProvider,
} = require("../controllers/users.controller");

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.patch("/provider",verifyToken, allowTo("user"), userToProvider);
router.get("/me", verifyToken, getMe);

module.exports = router;
