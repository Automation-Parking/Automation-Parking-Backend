// src/validation/payment-validation.js
import Joi from 'joi';

const paymentValidation = Joi.object({
  totalPrice: Joi.number().positive().required(),
});

export { paymentValidation };