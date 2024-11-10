// src/application/web.js
import express from 'express';
import { iotRouter } from '../route/api.js';
import { errorMiddleware } from '../middleware/error-middleware.js';
import cors from 'cors';

const web = express();
web.use(express.json());
web.use(cors({ origin: 'http://127.0.0.1:3001' }));

web.use(iotRouter);


web.use(errorMiddleware);

export default web;