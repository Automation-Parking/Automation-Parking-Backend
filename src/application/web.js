// src/application/web.js
import express from "express";
import { iotRouter } from "../route/api.js";
import { adminRouter } from "../route/admin-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cors from "cors";

// const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:3001"];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

const web = express();
web.use(express.json());
web.use(cors());
web.use(express.urlencoded({ extended: true }));
web.use(iotRouter);
web.use(adminRouter);

web.use(errorMiddleware);

export default web;
