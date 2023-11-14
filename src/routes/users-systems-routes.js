import express from 'express';
import { verifyToken } from '../utils/auth.js';
import { createRequest, usersSystem, requestsSystem, acceptRequest, rejectRequest, leaveSystem } from '../controllers/users-systems-controller.js';

const router = express.Router();

router.use(verifyToken);

router.post('/:id/join-request', createRequest);
router.get('/:id/users', usersSystem);
router.get('/:id/requests', requestsSystem);
// router.post('/:id/join-request', addUser);
router.put('/join-request/:id', acceptRequest);
router.delete('/join-request/:id', rejectRequest);
router.delete('/:id/leave', leaveSystem);

export default router;
