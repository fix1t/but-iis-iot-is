import express from 'express';
import { createDevice, getMyDevices, getDeviceById, getAllTypes, getAllParametersAndValuesByDeviceId } from '../controllers/devices-controller.js';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/my-devices', verifyToken, getMyDevices);
router.get('/types', verifyToken, getAllTypes);
router.get('/:device_id', verifyToken, getDeviceById);
router.get('/:device_id/parameters', verifyToken, getAllParametersAndValuesByDeviceId);
//post
router.post('/create/:system_id', verifyToken, continueIfUserIsInSystem, createDevice);
router.post('/create', verifyToken, createDevice);

export default router;
