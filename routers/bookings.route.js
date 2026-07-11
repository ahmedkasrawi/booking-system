const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const validateMiddleware = require("../middlewares/validateMiddleware");
const { roles } = require("../constants/index");
const {
  createBookingSchema,
  updateBookingStatusSchema,
} = require("../validators/bookingValidator");
const {
  getBookings,
  getMyBookings,
  addBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
  getAvailableSlots,
} = require("../controllers/booking.controller");

// client only
router.post(
  "/",
  verifyToken,
  validateMiddleware(createBookingSchema),
  addBooking,
);
router.get("/my", verifyToken, getMyBookings);
router.patch("/cancel/:id", verifyToken, cancelMyBooking);

// admin and provider
router.get("/available-slots", getAvailableSlots);
router.get(
  "/",
  verifyToken,
  allowedTo(roles.admin, roles.provider),
  getBookings,
);
router
  .route("/:id")
  .patch(
    verifyToken,
    allowedTo(roles.admin, roles.provider),
    validateMiddleware(updateBookingStatusSchema),
    updateBookingStatus,
  );

module.exports = router;
