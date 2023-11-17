import express from 'express';
import { getAllSystems, getSystemByID, createSystem, updateSystem, deleteSystem} from '../controllers/systems-controller.js';
//, getCurrentUserSystems, deleteSystem, getCurrentUserSystems 
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

router.get('/get', getAllSystems);
router.get('/:id', getSystemByID);
//router.get('in',verifyToken, getCurrentUserSystems);
router.post('/create',verifyToken, createSystem);
router.put('/:id', verifyToken, updateSystem);
router.delete('/:id', verifyToken, deleteSystem);

export default router;