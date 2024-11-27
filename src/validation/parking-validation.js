// src/validation/parking-validation.js
import Joi from 'joi';

const parkInValidation = Joi.object({
  platNomor: Joi.string().allow(null).allow('').optional(),
});

const parkOutValidation = Joi.object({
  platNomor: Joi.string().allow(null).allow('').optional(),
});

export { parkInValidation, parkOutValidation };