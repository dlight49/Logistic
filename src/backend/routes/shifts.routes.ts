import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { startShift, endShift, getCurrentShift } from '../controllers/shifts.controller.js';

const router = express.Router();

router.post('/start', requireAuth, startShift);
router.post('/end', requireAuth, endShift);
router.get('/current', requireAuth, getCurrentShift);

export default router;
