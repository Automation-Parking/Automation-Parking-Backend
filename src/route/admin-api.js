// src/route/api.js
import express from "express";
import parkingOutController from "../controller/parkingOut-controller.js";
import reportController from "../controller/report-controller.js";
const adminRouter = new express.Router();

adminRouter.get("/api/getParkingOut", parkingOutController.getParkingOutData);
adminRouter.all("/api/report", reportController.generateReport);

export { adminRouter };
