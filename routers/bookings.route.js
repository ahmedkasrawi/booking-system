const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const {
  getBookings,
  getProviderBookings,
  getMyBookings,
  addBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
  getAvailableSlots,
} = require("../controllers/booking.controller");


// client only
router.post("/", verifyToken, addBooking);
router.get("/my", verifyToken, getMyBookings);
router.patch("/cancel/:id", verifyToken, cancelMyBooking);

// admin and provider
router.get(
  "/provider",
  verifyToken,
  allowedTo("provider"),
  getProviderBookings,
);
router.get("/available-slots", getAvailableSlots);
router.get("/", verifyToken, allowedTo("admin"), getBookings);
router
  .route("/:id")
  .patch(verifyToken, allowedTo("admin","provider"), updateBookingStatus)
  .delete(verifyToken, allowedTo("admin"), deleteBooking);

module.exports = router;
