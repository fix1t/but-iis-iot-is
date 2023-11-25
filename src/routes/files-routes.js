import express from 'express';
import {
	home, login, register,
	userList, userEdit,
	systemList, systemEdit, systemCreate, systemDetail, systemRequests,
	deviceDetail, deviceCreate,
	parameterDetail, typeList, typeCreate
} from '../controllers/files-controller.js';
import { verifyToken, redirectIfAuthenticated, continueIfUserIsInSystem, continueIfUserIsAdmin } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyToken, home);
router.get('/login', redirectIfAuthenticated, login);
router.get('/register', redirectIfAuthenticated, register);
router.get('/users', verifyToken, continueIfUserIsAdmin, userList);
router.get('/users/edit', verifyToken, userEdit);
router.get('/systems', verifyToken, systemList);
router.get('/systems/edit/:id', verifyToken, systemEdit);
router.get('/systems/create', verifyToken, systemCreate);
router.get('/systems-requests', verifyToken, systemRequests);
router.get('/systems/detail/:id', verifyToken, systemDetail);
router.get('/device/detail/:id', verifyToken, deviceDetail);
router.get('/device/create', verifyToken, deviceCreate);
router.get('/device/create/:system_id', verifyToken, continueIfUserIsInSystem, deviceCreate);
router.get('/types', verifyToken, typeList);
router.get('/types/create', verifyToken, typeCreate);
router.get('/parameters/:device_id/:parameter_id/', verifyToken, parameterDetail);

export default router;
