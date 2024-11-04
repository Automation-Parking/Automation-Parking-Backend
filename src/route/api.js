// new configuration route (not using this yet)
import express from 'express';
import parkingController from '../controller/parking-controller.js';
import paymentController from '../controller/payment-controller.js';
import webhookController from '../controller/webhook-controller.js';

const router = new express.Router();

// Praking router
router.post('/api/parkir/masuk', parkingController.parkIn);
router.post('/api/parkir/keluar', parkingController.parkOut);

// Payment router
router.post('/api/payment/', paymentController.createPayment);

// Webhook router
router.post('/api/webhook/midtrans', webhookController.handleWebhook);