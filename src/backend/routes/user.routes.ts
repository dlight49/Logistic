import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword, getAdmins, updateSelf, updateLocation } from '../controllers/user.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/admins', getAdmins);
router.patch('/me', updateSelf);
router.patch('/location', updateLocation);

router.use(requireAdmin);

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/reset-password', resetUserPassword);

export default router;
