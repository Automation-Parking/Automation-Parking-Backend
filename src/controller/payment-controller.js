// src/controller/payment-controller.js
import paymentService from '../service/payment-service.js';

const createPayment = async (req, res, next) => {
  try {
    const result = await paymentService.createPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createPayment,
};