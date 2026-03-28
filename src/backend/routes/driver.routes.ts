import { Router } from 'express';
import { updateLocation } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Secure location update
router.put('/location', requireAuth, updateLocation);

export default router;
