import express from 'express';
import { index, users } from '../controllers/files-controller.js';

const router = express.Router();

router.get('/', index);
router.get('/users', users);

export default router;
