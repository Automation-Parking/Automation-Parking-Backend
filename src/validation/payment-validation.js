// src/validation/payment-validation.js
import Joi from 'joi';

const paymentValidation = Joi.object({
  platNomor: Joi.string().required(),
  totalPrice: Joi.number().positive().required(),
});

export { paymentValidation };