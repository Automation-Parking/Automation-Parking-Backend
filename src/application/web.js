// src/application/web.js
import express from 'express';
import parkingRouter from '../route/parking.js';
import paymentRouter from '../route/payment.js';
import webhookRouter from '../route/webhook.js'; // Import the webhook router
import { errorMiddleware } from '../middleware/error-middleware.js';
import cors from 'cors';

const web = express();
web.use(express.json());
web.use(cors({ origin: 'http://127.0.0.1:3001' }));

web.use('/api/parkir', parkingRouter);
web.use('/api/payment', paymentRouter);
web.use('/api/webhook', webhookRouter);


web.use(errorMiddleware);

export default web;