const Joi = require("joi");

// Schema for creating a new service
const createServiceSchema = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Service title cannot be empty.",
    "string.min": "Service title must be at least 3 characters long.",
    "string.max": "Service title cannot exceed 50 characters.",
    "any.required": "Service title is required.",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Service description cannot be empty.",
    "string.min": "Description must be at least 10 characters long.",
    "any.required": "Service description is required.",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be greater than zero.",
    "any.required": "Price is required.",
  }),

  duration: Joi.number().valid(30, 60).required().messages({
    "any.only": "Duration must be exactly 30 or 60 minutes.",
    "any.required": "Duration is required.",
  }),

  category: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Category cannot be empty.",
    "string.min": "Category must be at least 3 characters long.",
    "string.max": "Category cannot exceed 50 characters.",
    "any.required": "Category is required.",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean value (true or false).",
  }),
});

const updateServiceSchema = Joi.object({
  title: Joi.string().trim().min(3).max(50).optional().messages({
    "string.empty": "Service title cannot be empty.",
    "string.min": "Service title must be at least 3 characters long.",
    "string.max": "Service title cannot exceed 50 characters.",
  }),

  description: Joi.string().trim().min(10).optional().messages({
    "string.empty": "Service description cannot be empty.",
    "string.min": "Description must be at least 10 characters long.",
  }),

  price: Joi.number().positive().optional().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be greater than zero.",
  }),

  duration: Joi.number().valid(30, 60).optional().messages({
    "any.only": "Duration must be exactly 30 or 60 minutes.",
  }),

  category: Joi.string().trim().min(3).max(50).optional().messages({
    "string.empty": "Category cannot be empty.",
    "string.min": "Category must be at least 3 characters long.",
    "string.max": "Category cannot exceed 50 characters.",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean value (true or false).",
  }),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update.",
  });

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};
