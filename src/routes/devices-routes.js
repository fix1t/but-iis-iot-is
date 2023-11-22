import express from 'express';
import { createDeviceInSystem, createDeviceOutsideSystem, getMyDevices } from '../controllers/devices-controller.js';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/my-devices', verifyToken, getMyDevices);
//post
router.post('/create/:system_id', verifyToken, continueIfUserIsInSystem, createDeviceInSystem);
router.post('/create', verifyToken, continueIfUserIsInSystem, createDeviceOutsideSystem);

export default router;
