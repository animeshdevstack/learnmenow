import Joi from "joi";

const createUserValidation = Joi.object({
  FName: Joi.string().required(),
  LName: Joi.string().required(),
  Phone: Joi.number().optional(),
  Email: Joi.string().email().required(),
  Password: Joi.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
  }),
});

const updateUserValidation = Joi.object({
  FName: Joi.string(),
  LName: Joi.string(),
  Phone: Joi.number().optional(),
  Email: Joi.string().email(),
  Password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$"))
    .messages({
      "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    }),
});

const signupUserValidation = Joi.object({
  FName: Joi.string().required(),
  LName: Joi.string().required(),
  Phone: Joi.number().optional(),
  Email: Joi.string().email().required(),
  Password: Joi.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
  }),
});

const signinUserValidation = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
  }),
});

const resendVerificationEmailValidation = Joi.object({
  Email: Joi.string().email().required(),
});

const forgotPasswordValidation = Joi.object({
  Email: Joi.string().email().required(),
});

const resetPasswordValidation = Joi.object({
  Password: Joi.string().required().min(8).max(16).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
  }),
});

export {
    createUserValidation,
    updateUserValidation,
    signupUserValidation,
    signinUserValidation,
    resendVerificationEmailValidation,
    forgotPasswordValidation,
    resetPasswordValidation
};