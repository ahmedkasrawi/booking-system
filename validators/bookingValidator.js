const Joi = require("joi");


const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const timeSlotPattern = /^([0-1]?\d|2[0-3]):[0-5]\d$/;

const createBookingSchema = Joi.object({
  provider: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid provider ID.",
    "any.required": "Provider ID is required.",
  }),

  service: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid service ID.",
    "any.required": "Service ID is required.",
  }),

  date: Joi.date().iso().required().messages({
    "date.base": "Please provide a valid date.",
    "date.format": "Date must be in ISO format (YYYY-MM-DD).",
    "any.required": "Booking date is required.",
  }),

  timeSlot: Joi.string().pattern(timeSlotPattern).required().messages({
    "string.pattern.base": "Time must be in 24-hour format (e.g., 14:30).",
    "any.required": "Time slot is required.",
  }),
});

// 2. فحص تحديث حالة الحجز (من طرف المستشار أو الإدارة)
const updateBookingStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .required()
    .messages({
      "any.only": "Status must be pending, confirmed, cancelled, or completed.",
      "any.required": "Status is required for update.",
    }),
});

module.exports = {
  createBookingSchema,
  updateBookingStatusSchema,
};
