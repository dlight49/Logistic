import { Router } from 'express';
import { getGlobalStats, getDriverStats } from '../controllers/stats.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', requireAdmin, getGlobalStats);
router.get('/driver/:id', getDriverStats);

export default router;
