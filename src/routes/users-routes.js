import express from 'express';
import { registerUser, deleteUser, getAllUsers, getUser } from '../controllers/users-controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.delete('/:id', deleteUser);
router.get('/get', getAllUsers);
router.get('/:id', getUser);

export default router;
