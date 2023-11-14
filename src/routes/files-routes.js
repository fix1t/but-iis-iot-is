import express from 'express';
import { home, login, register, systemUsers, users } from '../controllers/files-controller.js';
import { verifyToken, redirectIfAuthenticated } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyToken, home);
router.get('/login', redirectIfAuthenticated, login);
router.get('/register', redirectIfAuthenticated, register);
router.get('/users', verifyToken, users);
router.get('/systems', verifyToken, systemUsers);

export default router;
