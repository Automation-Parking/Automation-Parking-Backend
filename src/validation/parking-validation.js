// src/validation/parking-validation.js
import Joi from 'joi';

const parkInValidation = Joi.object({
  platNomor: Joi.string(),
});

const parkOutValidation = Joi.object({
  platNomor: Joi.string().required(),
});

export { parkInValidation, parkOutValidation };