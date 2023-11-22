import express from 'express';
import { getAllSystems, getSystemByID, createSystem, updateSystem, deleteSystem, getCurrentUserSystems } from '../controllers/systems-controller.js';
//, getCurrentUserSystems 
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

router.get('/get', getAllSystems);
router.get('/in', verifyToken, getCurrentUserSystems); //WARNING: has to be beffore /:id because then it takes "in" as id
router.get('/:id', getSystemByID);
router.post('/create', verifyToken, createSystem);
router.put('/:id', verifyToken, updateSystem);
router.delete('/:id', verifyToken, deleteSystem);

export default router;
