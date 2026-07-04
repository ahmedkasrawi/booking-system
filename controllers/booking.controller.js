const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const { Booking } = require("../models/Booking");
const { Service } = require("../models/Service");
const bookingService = require("../services/bookingService")
// admin only
const getBookings = asyncWrapper(async (req, res, next) => {
  const filter = {};
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const [totalBookings, bookings] = await Promise.all([
    Booking.countDocuments(filter),
    Booking.find(filter)
      .sort("-createdAt")
      .populate("client", "name email")
      .populate("provider", "name email")
      .populate("service", "title")
      .skip(skip)
      .limit(limit),
  ]);
  const totalPages = Math.ceil(totalBookings / limit);
  res.status(200).json({
    status: "success",
    pagination: {
      totalBookings,
      totalPages,
      currentPage: page,
      isPreviousPage: page > 1,
      isNextPage: page < totalPages,
    },
    results: bookings.length,
    data: { bookings },
  });
});
// client only
const getMyBookings = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = { client: req.user.id };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const [totalBookings, bookings] = await Promise.all([
    Booking.countDocuments(filter),
    Booking.find(filter)
      .sort("-createdAt")
      .populate("service", "title")
      .populate("provider", "name email")
      .skip(skip)
      .limit(limit),
  ]);
  const totalPages = Math.ceil(totalBookings / limit);
  res.status(200).json({
    status: "success",
    results: bookings.length,
    pagination: {
      totalBookings,
      totalPages,
      currentPage: page,
      isPreviousPage: page > 1,
      isNextPage: page < totalPages,
    },
    data: { bookings },
    message: "My bookings retrieved successfully",
  });
});
// provider only
const getProviderBookings = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = { provider: req.user.id };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const [totalBookings, bookings] = await Promise.all([
    Booking.countDocuments(filter),
    Booking.find(filter)
      .sort("-createdAt")
      .populate("client", "name")
      .populate("service", "title")
      .skip(skip)
      .limit(limit),
  ]);
  const totalPages = Math.ceil(totalBookings / limit);
  
  res.status(200).json({
    status: "success",
    results: bookings.length,
    pagination: {
      totalBookings,
      totalPages,
      currentPage: page,
      isPreviousPage: page > 1,
      isNextPage: page < totalPages,
    },
    data: { bookings },
    message: "Provider bookings retrieved successfully",
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
  getProviderBookings,
  getAvailableSlots,
  getMyBookings,
  addBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
};
