"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tickets_controller_js_1 = require("../controllers/tickets.controller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
router.use(authMiddleware_js_1.requireAuth);
router.get('/my', tickets_controller_js_1.getMyTickets);
router.post('/', tickets_controller_js_1.createTicket);
router.get('/:id', tickets_controller_js_1.getTicketById);
router.post('/:id/reply', tickets_controller_js_1.replyToTicket);
router.post('/:id/close', tickets_controller_js_1.closeTicket);
// Admin only
router.get('/admin/all', authMiddleware_js_1.requireAdmin, tickets_controller_js_1.getAllTickets);
exports.default = router;
//# sourceMappingURL=tickets.routes.js.map