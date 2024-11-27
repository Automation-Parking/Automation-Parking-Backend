// src/service/monitoring-service.js
import prisma from '../application/database.js';

const getParkingStatus = async () => {
  const parkingInCount = await prisma.parking_in.count();
  const parkingOutCount = await prisma.parking_out.count();

  const parkingInRecords = await prisma.parking_in.findMany();

  return {
    totalIn: parkingInCount,
    totalOut: parkingOutCount,
    parkingInRecords,
  };
};

export default {
  getParkingStatus,
};