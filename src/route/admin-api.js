// src/route/api.js
import express from "express";
import adminWebController from "../controller/adminWeb-controller.js";
import reportController from "../controller/report-controller.js";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const adminRouter = new express.Router();
adminRouter.use(authMiddleware);

adminRouter.get("/api/getParkingOut", adminWebController.getParkingOutData);
adminRouter.get("/api/getParkingByCity", adminWebController.getParkingByCity);
adminRouter.get(
  "/api/getParkingByRegion",
  adminWebController.getParkingByRegion
);
adminRouter.get("/api/getParkingByMonth", adminWebController.getParkingByMonth);
adminRouter.get(
  "/api/getParkingByWeek",
  adminWebController.getParkingByWeekInMonth
);
adminRouter.all("/api/report", reportController.generateReport);
adminRouter.get("/api/users/current", userController.get);
adminRouter.patch("/api/users/current", userController.update);
adminRouter.delete("/api/users/logout", userController.logout);

export { adminRouter };
