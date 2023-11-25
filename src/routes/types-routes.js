import express from 'express';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';
import { getAllTypesWithParameters } from '../controllers/type-controller.js';

const router = express.Router();

//get
router.get('/get', verifyToken, getAllTypesWithParameters);


export default router;
