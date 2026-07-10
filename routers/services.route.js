const express = require("express");
const router = express.Router();
const allowTo = require("../middlewares/allowedTo")
const verifyToken = require("../middlewares/verifyToken")
const validateMiddleware = require("../middlewares/validateMiddleware");
const { createServiceSchema, updateServiceSchema } = require("../validators/serviceValidator")
const {
  getServices,
  addService,
  getOneService,
  updateService,
  deleteService,
  toggleServiceStatus,
} = require("../controllers/services.controller");

router
  .route("/")
  .get(getServices)
  .post(
    verifyToken,
    allowTo("admin", "provider"),
    validateMiddleware(createServiceSchema),
    addService,
  );

router
  .route("/:id")
  .get(getOneService)
  .patch(
    verifyToken,
    allowTo("admin", "provider"),
    validateMiddleware(updateServiceSchema),
    updateService,
  )
  .delete(verifyToken, allowTo("admin", "provider"), deleteService);

router.route("/active/:id").patch(verifyToken,allowTo("admin","provider"),toggleServiceStatus);

module.exports = router;
