import express from 'express';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';
import { getAllTypesWithParameters, createType } from '../controllers/type-controller.js';

const router = express.Router();

//get
router.get('/get', verifyToken, getAllTypesWithParameters);
//post
router.post('/create', verifyToken, createType);


export default router;
