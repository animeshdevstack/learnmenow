import Joi from "joi";

const createTopicValidation = Joi.object({
  Name: Joi.string().required(),
  Duration: Joi.number().required(),
  Priority: Joi.number().required(),
  chapterId: Joi.string().required(),
});

const updateTopicValidation = Joi.object({
  Name: Joi.string(),
  Duration: Joi.number(),
  Priority: Joi.number(),
  chapterId: Joi.string(),
});

export {
    createTopicValidation,
    updateTopicValidation
};