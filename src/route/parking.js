// src/route/parking.js
import express from 'express';
import parkingController from '../controller/parking-controller.js';

const parkingRouter = express.Router();

parkingRouter.post('/masuk', parkingController.parkIn);
parkingRouter.post('/keluar', parkingController.parkOut);

export default parkingRouter;