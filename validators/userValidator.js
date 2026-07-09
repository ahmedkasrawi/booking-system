const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required().messages({
    "string.empty": "please enter the name",
    "string.min": "user name should be more than 3 characters",
    "string.max": "user name should be less than 20 characters",
    "any.required": "user name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "please enter the email",
    "string.email": "the email is not valid email",
    "any.required": "user email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "please enter the password",
    "string.min": "the password should be more than 6 characters",
    "any.required": "user password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "please enter the email",
    "string.email": "the email is not valid email",
    "any.required": "user email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "please enter the password",
    "any.required": "user password is required",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
