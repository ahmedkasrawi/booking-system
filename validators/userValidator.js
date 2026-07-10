const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z\s\u0600-\u06FF]+$/)
    .required()
    .messages({
      "string.empty": "please enter the name",
      "string.min": "user name should be more than 3 characters",
      "string.max": "user name should be less than 20 characters",
      "string.pattern.base": "name must only contain letters",
      "string.pattern.base": "name must only contain letters",
      "any.required": "user name is required",
    }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "please enter the email",
    "string.email": "the email is not valid email",
    "any.required": "user email is required",
  }),
  password: Joi.string()
    .min(8)
    // .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])"))
    .required()
    .messages({
      "string.empty": "please enter the password",
      "string.min": "the password should be at least 8 characters",
      "string.pattern.base":
        "password must contain at least one letter and one number",
      "any.required": "user password is required",
    }),

  passwordConfirm: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "passwords do not match",
    "any.required": "please confirm your password",
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
