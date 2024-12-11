// src/controller/error-records-controller.js
import prisma from '../application/database.js';
import { logger } from '../application/logging.js';

const fetchErrorRecords = async (req, res) => {
  const records = await prisma.parking_in.findMany();
  logger.info(`Error records ${records}`);

  res.status(200).json({ records });
};

export default {
  fetchErrorRecords,
};