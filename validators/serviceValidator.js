const Joi = require("joi");

// Schema for creating a new product (All core fields are required)
const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Product name cannot be empty.",
    "string.min": "Product name must be at least 3 characters long.",
    "string.max": "Product name cannot exceed 100 characters.",
    "any.required": "Product name is a required field.",
  }),
  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Product description cannot be empty.",
    "string.min": "Description must be at least 10 characters long.",
    "any.required": "Product description is a required field.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "Price is a required field.",
  }),
  countInStock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock count must be a number.",
    "number.integer": "Stock count must be an integer.",
    "number.min": "Stock count cannot be negative.",
    "any.required": "Stock count is a required field.",
  }),
  images: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Images must be an array of image URLs.",
    "string.uri": "Each image link must be a valid URL.",
  }),
});

// Schema for updating an existing product (Fields are optional but must match rules if provided)
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).messages({
    "string.empty": "Product name cannot be empty.",
    "string.min": "Product name must be at least 3 characters long.",
    "string.max": "Product name cannot exceed 100 characters.",
  }),
  description: Joi.string().trim().min(10).messages({
    "string.empty": "Product description cannot be empty.",
    "string.min": "Description must be at least 10 characters long.",
  }),
  price: Joi.number().positive().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
  }),
  countInStock: Joi.number().integer().min(0).messages({
    "number.base": "Stock count must be a number.",
    "number.integer": "Stock count must be an integer.",
    "number.min": "Stock count cannot be negative.",
  }),
  images: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Images must be an array of image URLs.",
    "string.uri": "Each image link must be a valid URL.",
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
