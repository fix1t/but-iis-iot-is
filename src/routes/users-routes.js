import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, updateUser, deleteUser, getAllUsers, getUser } from '../controllers/users-controller.js';
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyToken, getCurrentUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.get('/getAll', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUser);

export default router;
