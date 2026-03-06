import { Router } from 'express';
import { db, prisma } from '../config/db.js';
import { getSettings, updateSettings, getNotificationLogs, uploadDoc, updateDocStatus } from '../controllers/misc.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
const router = Router();
router.put('/users/me', requireAuth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        await db.collection('users').doc(req.user.id).update({
            name,
            phone,
            updatedAt: new Date()
        });
        res.json({ id: req.user.id, name, phone });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Docs (Used by Operator & Admin)
router.post('/shipments/:id/docs', requireAuth, uploadDoc);
router.patch('/docs/:id', requireAuth, requireAdmin, updateDocStatus);
// Settings (Admin only)
router.get('/settings', requireAuth, requireAdmin, getSettings);
router.patch('/settings', requireAuth, requireAdmin, updateSettings);
router.get('/notifications/logs', requireAuth, requireAdmin, getNotificationLogs);
export default router;
//# sourceMappingURL=misc.routes.js.map