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

router.get('/admin', verifyToken, continueIfUserIsAdmin, userList);
router.get('/users/edit', verifyToken, userEdit);

router.get('/systems', verifyToken, systemList);

router.get('/systems/create', verifyToken, systemCreate);
router.get('/systems/requests', verifyToken, systemRequests);
router.get('/systems/:system_id', verifyToken, systemDetail);
router.get('/systems/:system_id/edit', verifyToken, systemEdit);
//device create in system
router.get('/systems/:system_id/device-create', verifyToken, deviceCreate);
//device detail
router.get('/systems/:system_id/:device_id', verifyToken, deviceDetail);
//device params

//types
router.get('/types', verifyToken, typeList);
router.get('/types/create', verifyToken, continueIfUserIsAdmin, typeCreate);

//out of system
router.get('/device-create', verifyToken, deviceCreate);
router.get('/:device_id', verifyToken, deviceDetail);
router.get('/:device_id/:parameter_id', verifyToken, parameterDetail);

export default router;
