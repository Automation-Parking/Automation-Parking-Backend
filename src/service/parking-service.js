// src/service/parking-service.js
import prisma from "../application/database.js";
import { logger } from "../application/logging.js";
import { sendToClients } from "../main.js";
import {
  parkInValidation,
  parkOutValidation,
} from "../validation/parking-validation.js";
import { validate } from "../validation/validation.js";
import paymentService from "./payment-service.js";
import axios from "axios";

const parkIn = async (request) => {
  let parking = validate(parkInValidation, request);

  const openGate = async () => {
    try {
      // IoT server's URL and endpoint
      const iotServerUrl = "http://192.168.43.138/gerbangMasuk";
      const response = await axios.get(iotServerUrl);
      logger.info(`Gate opened:`, response.data);
    } catch (error) {
      logger.error(`Failed to open gate: ${error.message}`);
    }
  };

  if (parking.platNomor === null || parking.platNomor === "null") {
    parking.platNomor = Math.random(0, 9999999999).toString();
  }

  const waktuMasuk = new Date();
  const parkingIn = await prisma.parking_in.create({
    data: {
      platNomor: parking.platNomor,
      waktuMasuk: waktuMasuk,
      wilayah: parking.wilayah,
      kota_provinsi: parking.kota_provinsi,
      jenisKendaraan: parking.jenis_kendaraan,
      imageLink: parking.image_link,
    },
  });

  logger.info(`Car parked: ${parking.platNomor} at ${waktuMasuk}`);
  sendToClients({
    event: "PARK_IN",
    message: `Car parked: ${parking.platNomor}`,
  });
  await openGate();
  return { message: "Car parked successfully", parkingIn };
};

const parkOut = async (request) => {
  const parking = validate(parkOutValidation, request);

  const waktuKeluar = new Date();
  const parkingIn = await prisma.parking_in.findFirst({
    where: {
      platNomor: parking.platNomor,
    },
  });

  if (!parkingIn) {
    sendToClients({
      event: "ERROR",
      message: `No parking record found for ${parking.platNomor}.`,
    });
    throw new Error("No parking record found for this license plate.");
  }

  const durasiJam = Math.ceil(
    (waktuKeluar - parkingIn.waktuMasuk) / (1000 * 60 * 60)
  );
  const biayaTotal = durasiJam * 5000; // Example price calculation

  const paymentData = {
    totalPrice: biayaTotal,
  };

  let createdPayment;

  try {
    createdPayment = await paymentService.createPayment(paymentData);
    const parkingOut = await prisma.parking_out.create({
      data: {
        platNomor: parking.platNomor,
        waktuMasuk: parkingIn.waktuMasuk,
        waktuKeluar,
        totalTime: durasiJam,
        wilayah: parking.wilayah,
        kota_provinsi: parking.kota_provinsi,
        jenisKendaraan: parking.jenis_kendaraan,
        imageLink: parking.image_link,
        payment: {
          connect: { id: createdPayment.paymentId }, // Use the created payment ID
        },
      },
    });

    // Delete from parking_in table
    await prisma.parking_in.delete({
      where: { id: parkingIn.id },
    });

    logger.info(`Car exited: ${parking.platNomor} at ${waktuKeluar}`);

    // Send a message indicating the car has exited and the total cost
    sendToClients({
      event: "PARK_OUT",
      message: `Car exited: ${parking.platNomor}, Total Cost: ${biayaTotal}`,
    });
    return { message: "Car exited successfully", parkingOut };
  } catch (paymentError) {
    logger.error(`Payment creation failed: ${paymentError.message}`);
    sendToClients({
      event: "PAYMENT_ERROR",
      message: `Payment failed for ${parking.platNomor}.`,
    });
    throw new Error("Payment creation failed.");
  }
};

const processUpdatedRecord = async (updatedRecord) => {
  const parking = updatedRecord;
  console.log(parking);
  const waktuKeluar = new Date();
  const parkingIn = await prisma.parking_in.findFirst({
    where: {
      platNomor: parking.platNomor,
    },
  });

  if (!parkingIn) {
    sendToClients({
      event: "ERROR",
      message: `No parking record found for ${updatedRecord.platNomor}.`,
    });
    throw new Error("No parking record found for this license plate.");
  }

  const durasiJam = Math.ceil(
    (waktuKeluar - parkingIn.waktuMasuk) / (1000 * 60 * 60)
  );
  const biayaTotal = durasiJam * 5000; // Example price calculation

  const paymentData = {
    totalPrice: biayaTotal,
  };

  let createdPayment;

  try {
    createdPayment = await paymentService.createPayment(paymentData);
    const parkingOut = await prisma.parking_out.create({
      data: {
        platNomor: parking.platNomor,
        waktuMasuk: parkingIn.waktuMasuk,
        waktuKeluar,
        totalTime: durasiJam,
        wilayah: "undefined",
        kota_provinsi: "undefined",
        jenisKendaraan: "undefined",
        imageLink: "undefined",
        payment: {
          connect: { id: createdPayment.paymentId }, // Use the created payment ID
        },
      },
    });

    // Delete from parking_in table
    await prisma.parking_in.delete({
      where: { id: parkingIn.id },
    });

    logger.info(`Car exited: ${parking.platNomor} at ${waktuKeluar}`);

    // Send a message indicating the car has exited and the total cost
    sendToClients({
      event: "PARK_OUT",
      message: `Car exited: ${parking.platNomor}, Total Cost: ${biayaTotal}`,
    });
    return { message: "Car exited successfully", parkingOut };
  } catch (paymentError) {
    logger.error(`Payment creation failed: ${paymentError.message}`);
    sendToClients({
      event: "PAYMENT_ERROR",
      message: `Payment failed for ${updatedRecord.platNomor}.`,
    });
    throw new Error("Payment creation failed.");
  }
};

export default {
  parkIn,
  parkOut,
  processUpdatedRecord,
};
