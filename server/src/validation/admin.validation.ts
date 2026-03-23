import Joi from "joi";

const createAdminValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5).max(16),
});

export { createAdminValidation };