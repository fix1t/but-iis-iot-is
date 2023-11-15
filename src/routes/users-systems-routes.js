import express from 'express';
import { verifyToken } from '../utils/auth.js';
import { createRequest, usersSystem, usersNotSystem, requestsSystem, addUser, acceptRequest, rejectRequest, leaveSystem, removeUser } from '../controllers/users-systems-controller.js';

const router = express.Router();

router.use(verifyToken);

router.post('/:id/join-request', createRequest);
router.get('/:id/users', usersSystem);
router.get('/:id/users/not', usersNotSystem);
router.get('/:id/requests', requestsSystem);
router.post('/:id/users/:id', addUser);
router.put('/join-request/:id', acceptRequest);
router.delete('/join-request/:id', rejectRequest);
router.delete('/:id/leave', leaveSystem);
router.delete('/:id/remove/:id', removeUser);

export default router;
