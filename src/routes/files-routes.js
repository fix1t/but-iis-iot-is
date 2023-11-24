import express from 'express';
import { home, login, register, userList, userEdit, systemUsers, systemList, systemEdit, systemCreate, systemDetail, systemRequests, deviceDetail, deviceCreate } from '../controllers/files-controller.js';
import { verifyToken, redirectIfAuthenticated, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyToken, home);
router.get('/login', redirectIfAuthenticated, login);
router.get('/register', redirectIfAuthenticated, register);
router.get('/users', verifyToken, userList);
router.get('/users/edit', verifyToken, userEdit);
router.get('/systems', verifyToken, systemList);
router.get('/systems/edit/:id', verifyToken, systemEdit);
router.get('/systems/create', verifyToken, systemCreate);
router.get('/systems/util', verifyToken, systemUsers);
router.get('/systems-requests', verifyToken, systemRequests);
router.get('/systems/detail/:id', verifyToken, systemDetail);
router.get('/device/detail/:id', verifyToken, deviceDetail);
router.get('/device/create/:system_id', verifyToken, continueIfUserIsInSystem, deviceCreate);

export default router;
