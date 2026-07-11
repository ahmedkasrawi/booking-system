const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const { Booking } = require("../models/Booking");
const { Service } = require("../models/Service");
const bookingService = require("../services/bookingService")
const { roles } = require("../constants/index")
// admin and provider only
const getBookings = asyncWrapper(async (req, res, next) => {
  let filter = {};
  let populateOptions = [
    { path: "client", select: "name email" },
    { path: "provider", select: "name email" },
    { path: "service", select: "title" },
  ];
  if(req.user.role === roles.provider){
    filter = { provider: req.user.id };
    populateOptions = [
      { path: "service", select: "title" },
      { path: "client", select: "name" },
    ];
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const [data, pagination] = await getData(
    req,
    filter,
    Booking,
    populateOptions,
  );
  res.status(200).json({
    status: "success",
    pagination,
    results: data.length,
    data: { bookings: data },
  });
});
// client only
const getMyBookings = asyncWrapper(async (req, res, next) => {
  const filter = { client: req.user.id };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const populateOptions = [
    { path: "service", select: "title" },
    { path: "provider", select: "name email" },
  ];
  const [data, pagination] = await getData(
    req,
    filter,
    Booking,
    populateOptions,
  );
  
  res.status(200).json({
    status: "success",
    results: data.length,
    pagination,
    data: { bookings: data },
    message: "My bookings retrieved successfully",
  });
});

// client only
const addBooking = asyncWrapper(async (req, res, next) => {
  const booking = await bookingService.makeNewBooking(req.body, req.user.id);
  res.status(201).json({ status: "success", data: { booking } });
});
//
const getAvailableSlots = asyncWrapper(async (req, res, next) => {
  const { providerId, date } = req.query;

  if (!providerId || !date) {
    return next(new appError("please inter date and providerID", 400));
  }

  const availableSlots = await bookingService.getAvailableSlots(
    providerId,
    date,
  );

  res.status(200).json({
    status: "success",
    results: availableSlots.length,
    data: { availableSlots },
  });
});

// provider or admin only
const updateBookingStatus = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new appError("Booking not found", 404));
  }
  if (
    booking.provider.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new appError("Unauthorized to update this booking", 403));
  }
  if (
    status &&
    !["pending", "confirmed", "cancelled", "completed"].includes(status)
  ) {
    return next(new appError("Invalid booking status", 400));
  }
  if (
    paymentStatus &&
    !["unpaid", "paid", "refunded"].includes(paymentStatus)
  ) {
    return next(new appError("Invalid payment status", 400));
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  await booking.save();

  res.status(200).json({
    status: "success",
    data: { booking },
    message: "Booking status updated successfully",
  });
});
// client only
const cancelMyBooking = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new appError("Booking not found", 404));
  }
  if (booking.client.toString() !== req.user.id) {
    return next(new appError("Unauthorized", 401));
  }
  if (booking.status === "completed" || booking.status === "cancelled") {
    return next(new appError(`Cannot cancel a ${booking.status} booking`, 400));
  }
  booking.status = "cancelled";
  await booking.save();
  res.status(200).json({
    status: "success",
    data: { booking },
    message: "booking cancelled successfully",
  });
});
// admin only
const deleteBooking = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = await Booking.findByIdAndDelete(id);
  if (!data) {
    return next(new appError("Booking not found", 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Booking deleted successfully" });
});

module.exports = {
  getBookings,
  getAvailableSlots,
  getMyBookings,
  addBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
};
