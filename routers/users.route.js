const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowedTo");
const { registerSchema, loginSchema } = require("../validators/userValidator");
const validate = require("../middlewares/validateMiddleware");
const { roles } = require("../constants/index");
const {
  registerUser,
  loginUser,
  getMe,
  userToProvider,
  getAllProviders,
  getProvider,
  updateMe,
} = require("../controllers/users.controller");

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/provider", getAllProviders);
router.route("/me").get(verifyToken, getMe).patch(verifyToken, updateMe);
router.patch("/provider", verifyToken, allowTo("user"), userToProvider);
router.get("/provider/:id", getProvider);
module.exports = router;
