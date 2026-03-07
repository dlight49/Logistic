import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * POST /auth/login — Development-only mock login.
 * In production, authentication is handled entirely by Firebase on the
 * frontend; the backend verifies tokens via requireAuth middleware.
 */
router.post('/login', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
            error: 'Direct login is disabled in production. Use Firebase authentication.'
        });
    }

    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await prisma.user.findFirst({
            where: { OR: [{ email }, { id: email }] }
        });

        if (user) {
            console.warn(`[AUTH] Dev-only mock login used for: ${email}`);
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /auth/me — Returns the current authenticated user profile.
 * Requires a valid Firebase token.
 */
router.get('/me', requireAuth, (req, res) => {
    res.json(req.user);
});

export default router;
