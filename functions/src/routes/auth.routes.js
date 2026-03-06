"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Returns the currently authenticated user's profile.
 * The user object is populated by the requireAuth middleware.
 */
router.get('/me', authMiddleware_1.requireAuth, (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});
// The legacy /login route is removed because client-side 
// Firebase Auth should be used. The backend only verifies the token.
exports.default = router;
//# sourceMappingURL=auth.routes.js.map