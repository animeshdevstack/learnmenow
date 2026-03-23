import Joi from "joi";

const createSubjectValidation = Joi.object({
  Name: Joi.string().required(),
  Duration: Joi.number().required(),
  Priority: Joi.number().required(),
  competionId: Joi.string().required(),
});

const updateSubjectValidation = Joi.object({
  Name: Joi.string(),
  Duration: Joi.number(),
  Priority: Joi.number(),
  competionId: Joi.string(),
});

export {
    createSubjectValidation,
    updateSubjectValidation
};