"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipments_controller_js_1 = require("../controllers/shipments.controller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// Publicly tracking
router.get('/:id/track', shipments_controller_js_1.getShipmentById);
// Protected routes
router.use(authMiddleware_js_1.requireAuth);
router.get('/', shipments_controller_js_1.getShipments);
router.post('/quotes', shipments_controller_js_1.createQuote);
router.get('/me', shipments_controller_js_1.getMyShipments);
router.get('/:id', shipments_controller_js_1.getShipmentById);
router.post('/:id/updates', shipments_controller_js_1.updateShipmentTracking);
router.get('/tracking/live', shipments_controller_js_1.getLiveLocations);
// Admin only operations
router.post('/', authMiddleware_js_1.requireAdmin, shipments_controller_js_1.createShipment);
router.post('/:id/assign', authMiddleware_js_1.requireAdmin, shipments_controller_js_1.assignOperator);
exports.default = router;
//# sourceMappingURL=shipments.routes.js.map