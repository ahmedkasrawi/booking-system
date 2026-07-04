const { Booking } = require("../models/Booking");
const { Service } = require("../models/Service");
const appError = require("../utils/appError");

// make a new booking
const makeNewBooking = async (bookingData, clientId) => {
  const { service, provider, date, timeSlot } = bookingData;

  // 1. check if the booking date is in the past
  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new appError("You cannot book an appointment in the past", 400);
  }
  // 2. check the validity of the service and its association with the service provider and ensure it is active
  const serviceObj = await Service.findOne({
    _id: service,
    provider: provider,
    isActive: true,
  });

  if (!serviceObj) {
    throw new appError("Service not found or not available at the moment", 404);
  }

  // 3. prevent double booking
  const exist = await Booking.findOne({
    provider,
    date: bookingDate,
    timeSlot,
    status: { $in: ["pending", "confirmed"] },
  });

  if (exist) {
    throw new appError(
      "This time slot is already booked for this provider",
      400,
    );
  }

  // 4. create the booking and freeze the price and duration for future protection
  const booking = await Booking.create({
    client: clientId,
    provider,
    service,
    date,
    timeSlot,
    bookedPrice: serviceObj.price,
    bookedDuration: serviceObj.duration,
  });

  return booking;
};

// function to fetch available time slots dynamically (the key feature for the MVP)
const getAvailableSlots = async (providerId, date) => {
  const allSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const queryDate = new Date(date);
  queryDate.setHours(0, 0, 0, 0); // توحيد وقت البحث لبداية اليوم

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. حماية منطقية: إذا كان التاريخ في الماضي، لا توجد مواعيد متاحة
  if (queryDate < today) {
    return [];
  }

  // 2. تحديد بداية ونهاية اليوم لضمان دقة البحث في قاعدة البيانات
  const startOfDay = new Date(queryDate);
  const endOfDay = new Date(queryDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 3. جلب الحجوزات النشطة في نطاق هذا اليوم فقط
  const bookedSlots = await Booking.find({
    provider: providerId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $in: ["pending", "confirmed"] },
  }).select("timeSlot");

  const reservedTimes = bookedSlots.map((booking) => booking.timeSlot);

  // 4. فلترة المواعيد المحجوزة
  let availableSlots = allSlots.filter((slot) => !reservedTimes.includes(slot));

  // 5. إذا كان الاستعلام عن اليوم الحالي، قم بإخفاء المواعيد التي مرت
  if (queryDate.getTime() === today.getTime()) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    availableSlots = availableSlots.filter((slot) => {
      const [slotHour, slotMinute] = slot.split(":").map(Number);
      return (
        slotHour > currentHour ||
        (slotHour === currentHour && slotMinute > currentMinutes)
      );
    });
  }

  return availableSlots;
};

module.exports = {
  makeNewBooking,
  getAvailableSlots,
};
