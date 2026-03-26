import { Router } from 'express';
import { getOperators, createOperator, updateOperator, resetOperatorPassword, deleteOperator } from '../controllers/operators.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Only Admins can manage operators
router.use(requireAuth);
router.use(requireAdmin);

router.get('/', getOperators);
router.post('/', createOperator);
router.patch('/:id', updateOperator);
router.delete('/:id', deleteOperator);
router.post('/:id/reset-password', resetOperatorPassword);

export default router;
