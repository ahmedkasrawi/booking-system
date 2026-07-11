const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { booking_status } = require("../constants/index");
const bookingSchema = new schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // التعديل الجوهري: ربط الحجز بمقدم الخدمة (الدكتور، الحلاق، المستشار)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookedPrice: {
      type: Number,
      required: true, // يتم سحبه من موديل الخدمة لحظة الحجز وحفظه هنا للابد
    },
    bookedDuration: {
      type: Number,
      required: true, // بالدقائق، لضمان ثبات سجلات الحجز القديمة
    },
    date: {
      type: Date, // يفضل الـ Frontend يبعتها بصيغة ISO (YYYY-MM-DD)
      required: true,
    },
    timeSlot: {
      type: String, // مثلاً: "10:00" أو "14:30"
      required: true,
    },
    status: {
      type: String,
      enum: [
        booking_status.pending,
        booking_status.confirmed,
        booking_status.cancelled,
        booking_status.completed,
      ],
      default: booking_status.pending,
      required: true,
    },
    // ميزة إضافية: تتبع حالة الدفع لربطها ببوابات الدفع لاحقاً
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
      required: true,
    },
    paymentReference: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index(
  { provider: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [booking_status.pending, booking_status.confirmed] },
    },
  },
);

module.exports = {
  Booking: mongoose.model("Booking", bookingSchema),
};
