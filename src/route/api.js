// src/route/api.js
import express from 'express';
import parkingController from '../controller/parking-controller.js';
import paymentController from '../controller/payment-controller.js';
import webhookController from '../controller/webhook-controller.js';

const iotRouter = new express.Router();

// Praking iotRouter
iotRouter.post('/api/parkir/masuk', parkingController.parkIn);
iotRouter.post('/api/parkir/keluar', parkingController.parkOut);

// Payment iotRouter
iotRouter.post('/api/payment/', paymentController.createPayment);

// Webhook iotRouter
iotRouter.post('/api/webhook/midtrans', webhookController.handleWebhook);

export {
  iotRouter
}