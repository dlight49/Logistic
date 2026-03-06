"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../config/db.js");
const misc_controller_js_1 = require("../controllers/misc.controller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
router.put('/users/me', authMiddleware_js_1.requireAuth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const updatedUser = await db_js_1.prisma.user.update({
            where: { id: req.user.id },
            data: { name, phone }
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Docs (Used by Operator & Admin)
router.post('/shipments/:id/docs', authMiddleware_js_1.requireAuth, misc_controller_js_1.uploadDoc);
router.patch('/docs/:id', authMiddleware_js_1.requireAuth, authMiddleware_js_1.requireAdmin, misc_controller_js_1.updateDocStatus);
// Settings (Admin only)
router.get('/settings', authMiddleware_js_1.requireAuth, authMiddleware_js_1.requireAdmin, misc_controller_js_1.getSettings);
router.patch('/settings', authMiddleware_js_1.requireAuth, authMiddleware_js_1.requireAdmin, misc_controller_js_1.updateSettings);
router.get('/notifications/logs', authMiddleware_js_1.requireAuth, authMiddleware_js_1.requireAdmin, misc_controller_js_1.getNotificationLogs);
exports.default = router;
//# sourceMappingURL=misc.routes.js.map