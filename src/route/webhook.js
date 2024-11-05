// src/route/webhook.js
import express from 'express';
import webhookController from '../controller/webhook-controller.js';

const webhookRouter = express.Router();

webhookRouter.post('/midtrans', webhookController.handleWebhook);

export default webhookRouter;