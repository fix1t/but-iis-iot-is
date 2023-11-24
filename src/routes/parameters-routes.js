import express from 'express';
import { getParameterById } from '../controllers/parameters-controller.js';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/:parameter_id', verifyToken, getParameterById);

export default router;
