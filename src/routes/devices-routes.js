import express from 'express';
import { createDeviceInSystem, getMyDevices } from '../controllers/devices-controller.js';
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/my-devices', verifyToken, getMyDevices);
//post
router.post('/create', verifyToken, createDeviceInSystem);

export default router;
