import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * Returns the currently authenticated user's profile.
 * The user object is populated by the requireAuth middleware.
 */
router.get('/me', requireAuth, (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// The legacy /login route is removed because client-side 
// Firebase Auth should be used. The backend only verifies the token.

export default router;
