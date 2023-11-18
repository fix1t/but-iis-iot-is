import express from 'express';
import { verifyToken } from '../utils/auth.js';
import { createRequest, getAllSystemUsers, getAllUsersNotInSystem, getSystemRequests, addUser, acceptRequest, rejectRequest, leaveSystem, removeUser } from '../controllers/users-systems-controller.js';

const router = express.Router();

router.use(verifyToken);

router.post('/:system_id/join-request', createRequest);
router.get('/:system_id/users', getAllSystemUsers);
router.get('/:system_id/users/not', getAllUsersNotInSystem);
router.get('/:system_id/requests', getSystemRequests);
router.post('/:system_id/add-user', addUser);
router.put('/join-request/:request_id', acceptRequest);
router.delete('/join-request/:request_id', rejectRequest);
router.delete('/:system_id/leave', leaveSystem);
router.delete('/:system_id/remove-user', removeUser);

export default router;
