import express from 'express';
import { createDeviceInSystem, createDeviceOutsideSystem, getMyDevices, getDeviceById, getAllTypes } from '../controllers/devices-controller.js';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/my-devices', verifyToken, getMyDevices);
router.get('/types', verifyToken, getAllTypes);
router.get('/:device_id', verifyToken, getDeviceById);
//post
router.post('/create/:system_id', verifyToken, continueIfUserIsInSystem, createDeviceInSystem);
router.post('/create', verifyToken, createDeviceOutsideSystem);

export default router;
