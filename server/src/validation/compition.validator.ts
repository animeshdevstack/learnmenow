import Joi from "joi";

const createCompetionValidation = Joi.object({
  Name: Joi.string().required(),
  Desciption: Joi.string()
});

const updateCompetionValidation = Joi.object({
  Name: Joi.string(),
  Desciption: Joi.string()
});

export {
    createCompetionValidation,
    updateCompetionValidation
};