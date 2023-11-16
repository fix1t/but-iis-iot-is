import express from 'express';
import { getAllSystems, getSystemByID, createSystem} from '../controllers/systems-controller.js';
//, getCurrentUserSystems, updateSystem, deleteSystem 
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

router.get('/get', getAllSystems);
router.get('/:id', getSystemByID);
//router.get('in', getCurrentUserSystems);
router.post('/create',verifyToken, createSystem);
//router.put('/:id', verifyToken, updateSystem);
//router.delete('/:id', verifyToken, deleteSystem);

export default router;