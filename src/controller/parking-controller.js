// src/controller/parking-controller.js
import parkingService from '../service/parking-service.js';

const parkIn = async (req, res, next) => {
  try {
    const result = await parkingService.parkIn(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const parkOut = async (req, res, next) => {
  try {
    const result = await parkingService.parkOut(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  parkIn,
  parkOut,
};