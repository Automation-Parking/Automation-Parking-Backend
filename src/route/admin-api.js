// src/route/api.js
import express from "express";
import adminWebController from "../controller/adminWeb-controller.js";
import reportController from "../controller/report-controller.js";
const adminRouter = new express.Router();

adminRouter.get("/api/getParkingOut", adminWebController.getParkingOutData);
adminRouter.get("/api/getParkingByCity", adminWebController.getParkingByCity);
adminRouter.get("/api/getParkingByRegion",adminWebController.getParkingByRegion);
adminRouter.post("/api/getParkingByMonth",adminWebController.getParkingByMonth);
adminRouter.post("/api/getParkingByWeek",adminWebController.getParkingByWeekInMonth);
adminRouter.all("/api/report", reportController.generateReport);

export { adminRouter };
