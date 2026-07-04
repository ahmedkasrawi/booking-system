const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
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

// 🛡️ خط الحماية الأخير (Compound Index)
// هذا السطر يمنع قاعدة البيانات نهائياً من تكرار نفس الحجز (نفس مقدم الخدمة + نفس اليوم + نفس الساعة)
// حتى لو الـ Controller فشل في التشيك لأي سبب (كضغط طلبات متزامنة Concurrency)، الـ DB هترفض العملية.
bookingSchema.index(
  { provider: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] },
    },
  },
);

module.exports = {
  Booking: mongoose.model("Booking", bookingSchema),
};
