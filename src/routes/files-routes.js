import express from 'express';
import { index, login, register, users } from '../controllers/files-controller.js';

const router = express.Router();

router.get('/', index);
router.get('/login', login);
router.get('/register', register);
router.get('/users', users);

export default router;
