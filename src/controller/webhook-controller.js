// src/controller/webhook-controller.js
import paymentService from '../service/payment-service.js';
import { logger } from '../application/logging.js';
import { sendToClients } from '../main.js';
import axios from 'axios';

// Function to call the IoT API to open the gate
const openGate = async () => {
  try {
    // IoT server's URL and endpoint
    const iotServerUrl = 'http://192.168.29.138/gerbangKeluar';
    const response = await axios.get(iotServerUrl);
    logger.info(`Gate opened:`, response.data);
  } catch (error) {
    logger.error(`Failed to open gate: ${error.message}`);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    const notification = req.body;

    // Log the notification for debugging
    logger.info('Received webhook notification:', notification);

    // Validate the notification
    if (!notification.order_id || !notification.transaction_status) {
      return res.status(400).json({ message: 'Invalid notification' });
    }

    // Update payment status in the database using order_id
    await paymentService.updatePaymentStatus(notification.order_id, notification.transaction_status);

    // Send a single message to the frontend based on the transaction status
    if (notification.transaction_status === "settlement") {
      sendToClients({ event: "THANK_YOU", message: 'Pembayaran sukses, pintu terbuka' });
      res.status(200).json({ message: 'Pembayaran sukses, pintu terbuka' });
      await openGate();
    } else {
      res.status(200).json({ message: 'Transaksi diproses', status: notification.transaction_status });
    }
  } catch (error) {
    logger.error('Error handling webhook:', error);
    next(error);
  }
};


export default {
  handleWebhook,
};