"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_js_1 = require("../controllers/stats.controller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
router.use(authMiddleware_js_1.requireAuth);
router.get('/', authMiddleware_js_1.requireAdmin, stats_controller_js_1.getGlobalStats);
router.get('/driver/:id', stats_controller_js_1.getDriverStats);
exports.default = router;
//# sourceMappingURL=stats.routes.js.map