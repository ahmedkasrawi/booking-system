const mongoose = require("mongoose");
const schema = mongoose.Schema;

const serviceSchema = new schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // كل خدمة يجب أن يكون لها صاحب
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String, // : "Medical", "Salon", "Consulting"
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // تمكنك من إيقاف حجز خدمة مؤقتاً دون حذفها
    },
  },
  { timestamps: true },
);

module.exports = {
  Service: mongoose.model("Service", serviceSchema),
};
