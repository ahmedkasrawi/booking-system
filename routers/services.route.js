const express = require("express");
const router = express.Router();
const allowTo = require("../middlewares/allowedTo")
const verifyToken = require("../middlewares/verifyToken")
const validateMiddleware = require("../middlewares/validateMiddleware");
const { createServiceSchema, updateServiceSchema } = require("../validators/serviceValidator")
const { roles } = require("../constants/index");
const {
  getServices,
  addService,
  getOneService,
  updateService,
  toggleServiceStatus,
} = require("../controllers/services.controller");

router
  .route("/")
  .get(getServices)
  .post(
    verifyToken,
    allowTo(roles.provider, roles.admin),
    validateMiddleware(createServiceSchema),
    addService,
  );

router
  .route("/:id")
  .get(getOneService)
  .patch(
    verifyToken,
    allowTo(roles.provider, roles.admin),
    validateMiddleware(updateServiceSchema),
    updateService,
  )

router
  .route("/active/:id")
  .patch(verifyToken, allowTo(roles.provider, roles.admin), toggleServiceStatus);

module.exports = router;
