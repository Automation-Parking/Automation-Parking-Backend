// src/route/api.js
import express from 'express';
import parkingController from '../controller/parking-controller.js';
import paymentController from '../controller/payment-controller.js';
import webhookController from '../controller/webhook-controller.js';
import monitoringController from '../controller/monitoring-controller.js';
import manualInputController from '../controller/manual-input-controller.js';
import errorRecordsController from '../controller/error-records-controller.js';

const iotRouter = new express.Router();

// Parking IoT Router
iotRouter.post('/api/parkir/masuk', parkingController.parkIn);
iotRouter.post('/api/parkir/keluar', parkingController.parkOut);

// Payment IoT Router
iotRouter.post('/api/payment/', paymentController.createPayment);

// Webhook IoT Router
iotRouter.post('/api/webhook/midtrans', webhookController.handleWebhook);

// Monitoring IoT Router
iotRouter.get('/api/monitoring', monitoringController.getStatus);

// Manual Input IoT Router
iotRouter.post('/api/manual-input/update', manualInputController.updateRecord); // New route for updating records

// Error Records IoT Router
iotRouter.get('/api/error-records', errorRecordsController.fetchErrorRecords); // New route for fetching error records

export {
  iotRouter
}