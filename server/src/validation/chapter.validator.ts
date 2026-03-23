import Joi from "joi";

const createChapterValidation = Joi.object({
  Name: Joi.string().required(),
  Duration: Joi.number().required(),
  Priority: Joi.number().required(),
  subjectId: Joi.string().required(),
});

const updateChapterValidation = Joi.object({
  Name: Joi.string(),
  Duration: Joi.number(),
  Priority: Joi.number(),
  subjectId: Joi.string(),
});

export {
    createChapterValidation,
    updateChapterValidation
};