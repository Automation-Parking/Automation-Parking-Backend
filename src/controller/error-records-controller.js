// src/controller/error-records-controller.js
import prisma from '../application/database.js';

const fetchErrorRecords = async (req, res) => {
  const records = await prisma.parking_in.findMany();

  res.status(200).json({ records });
};

export default {
  fetchErrorRecords,
};