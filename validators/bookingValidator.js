const Joi = require("joi");
const mongoose = require("mongoose");
// Define a regular expression pattern for validating MongoDB ObjectId
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
// mongoose.Types.ObjectId.isValid;

const createOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().pattern(objectIdPattern).required().messages({
          "string.empty": "Product ID cannot be empty.",
          "string.pattern.base": "Invalid Product ID format.",
          "any.required": "Product ID is required for each item.",
        }),
        quantity: Joi.number().integer().positive().min(1).required().messages({
          //quantity
          "number.base": "Quantity must be a number.",
          "number.integer": "Quantity must be an integer.",
          "number.positive": "Quantity must be a positive number.",
          "number.min": "Quantity must be at least 1.",
          "any.required": "Quantity is required for each item.",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Order items must be provided as an array.",
      "array.min": "Your order must contain at least one item.",
      "any.required": "Order items are required.",
    }),
    
});

module.exports = {
  createOrderSchema,
};
