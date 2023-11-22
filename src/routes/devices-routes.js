import express from 'express';
import { createDeviceInSystem } from '../controllers/devices-controller.js';
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

router.post('/create', verifyToken, createDeviceInSystem);

export default router;
