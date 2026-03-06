import { Router } from 'express';
import { getShipments, getShipmentById, getMyShipments, createShipment, updateShipmentTracking, assignOperator, createQuote, getLiveLocations } from '../controllers/shipments.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
const router = Router();
// Publicly tracking
router.get('/:id/track', getShipmentById);
// Protected routes
router.use(requireAuth);
router.get('/', getShipments);
router.post('/quotes', createQuote);
router.get('/me', getMyShipments);
router.get('/:id', getShipmentById);
router.post('/:id/updates', updateShipmentTracking);
router.get('/tracking/live', getLiveLocations);
// Admin only operations
router.post('/', requireAdmin, createShipment);
router.post('/:id/assign', requireAdmin, assignOperator);
export default router;
//# sourceMappingURL=shipments.routes.js.map