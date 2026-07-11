const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    weeklyHours: [
      {
        day: {
          type: String,
          enum: [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
          required: true,
        },
        slots: [
          {
            type: String,
          },
        ],
      },
    ],
    blockedDates: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Availability", availabilitySchema);
