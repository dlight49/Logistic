import { Router } from 'express';
import { getOperators, createOperator, updateOperator } from '../controllers/operators.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Only Admins can manage operators
router.use(requireAuth);
router.use(requireAdmin);

router.get('/', getOperators);
router.post('/', createOperator);
router.patch('/:id', updateOperator);

export default router;
