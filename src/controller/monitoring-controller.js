// src/controller/monitoring-controller.js
import monitoringService from '../service/monitoring-service.js';

const getStatus = async (req, res, next) => {
  try {
    const status = await monitoringService.getParkingStatus();
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

export default {
  getStatus,
};