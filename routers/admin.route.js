const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowedTo");
const validate = require("../middlewares/validateMiddleware");
const { roles } = require("../constants/index");
const {
  getAllUsers,
  updateUserStatus,
  getUsersData,
} = require("../admin/user.controller");

router
  .route("/users")
  .get(verifyToken, allowTo(roles.admin), getAllUsers)
//  .patch(verifyToken, allowTo(roles.admin), updateUserStatus);

router.get("/users/chart", verifyToken, allowTo(roles.admin), getUsersData);
router
  .route("/users/:id")
  .patch(verifyToken, allowTo(roles.admin), updateUserStatus);

module.exports = router;
