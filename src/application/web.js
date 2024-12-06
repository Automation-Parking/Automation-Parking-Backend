// src/application/web.js
import express from 'express';
import { iotRouter } from '../route/api.js';
import { errorMiddleware } from '../middleware/error-middleware.js';
import { userRouter } from "../route/admin-api.js";
import cors from 'cors';

const web = express();
web.use(express.json());
web.use(cors());

web.use(iotRouter);
web.use(userRouter);
web.use(errorMiddleware);

export default web;