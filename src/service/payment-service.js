// src/service/payment-service.js
import axios from 'axios';
import { logger } from '../application/logging.js';
import { sendToClients } from '../main.js';
import { paymentValidation } from '../validation/payment-validation.js';
import prisma from '../application/database.js';

const createPayment = async (data) => {
  const serverKey = process.env.SERVER_KEY;
  const midtransUrl = process.env.MIDTRANS_URL;

  const { error } = paymentValidation.validate(data);
  if (error) throw new Error(error.details[0].message);

  const transactionDetails = {
    payment_type: 'qris',
    transaction_details: {
      order_id: `ORDER-${Date.now()}`,
      gross_amount: data.totalPrice,
    },
    customer_details: {
      email: "customer@example.com",
      first_name: "John",
      last_name: "Doe",
      phone: "081234567890"
    },
    item_details: {
      id: "p1",
      price: data.totalPrice,
      quantity: 1,
      name: "Parking Fee",
    },
  };

  try {
    const response = await axios.post(midtransUrl, transactionDetails, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(serverKey).toString('base64')
      }
    });

    const qrCodeUrl = response.data.actions.find(action => action.name === 'generate-qr-code').url;
    logger.info(`Payment created for ${data.platNomor}, QR Code URL: ${qrCodeUrl}`);

    // Optionally, you can save the payment details in the database
    await prisma.payment.create({
      data: {
        platNomor: data.platNomor,
        totalPrice: data.totalPrice,
        transactionId: response.data.order_id,
        status: response.data.transaction_status,
      },
    });

    sendToClients({ event: "SHOW_QR", qrCodeUrl });
    return { message: 'Payment created successfully', qrCodeUrl };
  } catch (error) {
    logger.error(`Payment creation failed: ${error.message}`);
    sendToClients({ event: "PAYMENT_ERROR", message: `Payment failed for ${data.platNomor}.` });
    throw new Error('Payment creation failed.');
  }
};

const updatePaymentStatus = async (orderId, transactionStatus) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { transactionId: orderId }, // Ensure this matches your database schema
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update the payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: transactionStatus },
    });

    logger.info(`Payment status updated for order ID ${orderId}: ${transactionStatus}`);
  } catch (error) {
    logger.error(`Failed to update payment status: ${error.message}`);
    throw new Error('Failed to update payment status');
  }
};

export default {
  createPayment,
  updatePaymentStatus,
};