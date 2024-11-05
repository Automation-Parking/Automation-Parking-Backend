// src/controller/webhook-controller.js
import paymentService from '../service/payment-service.js';
import { logger } from '../application/logging.js';
import { sendToClients } from '../main.js'; // Ensure this is imported

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
    if (notification.transaction_status === 'settlement') {
      sendToClients({ event: "THANK_YOU", message: 'Pembayaran sukses, pintu terbuka' });
      res.status(200).json({ message: 'Pembayaran sukses, pintu terbuka' });
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