import express from 'express';
import { registerUser, loginUser, deleteUser, getAllUsers, getUser } from '../controllers/users-controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/:id', deleteUser);
router.get('/get', getAllUsers);
router.get('/:id', getUser);

export default router;
