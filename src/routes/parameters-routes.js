import express from 'express';
import { getParameterById, getAllValuesByParameterIdAndDeviceId } from '../controllers/parameters-controller.js';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/:parameter_id', verifyToken, getParameterById);
router.get('/:parameter_id/values/:devices_id', verifyToken, getAllValuesByParameterIdAndDeviceId);

export default router;
