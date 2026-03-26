import { Router } from 'express';
import { getShipments, getShipmentById, getMyShipments, createShipment, updateShipmentTracking, assignOperator, createQuote, getLiveLocations, getPendingQuotes, approveQuote, rejectQuote, updateShipment } from '../controllers/shipments.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Publicly tracking
router.get('/:id/track', getShipmentById);

// Protected routes
router.use(requireAuth);

router.get('/', getShipments);
router.post('/quotes', createQuote);
router.get('/me', getMyShipments);
router.get('/tracking/live', getLiveLocations);

// Admin only operations
router.post('/', requireAdmin, createShipment);

// Admin Quote Management
router.get('/admin/quotes', requireAdmin, getPendingQuotes);
router.post('/admin/quotes/:id/approve', requireAdmin, approveQuote);
router.post('/admin/quotes/:id/reject', requireAdmin, rejectQuote);
router.patch('/:id', requireAdmin, updateShipment);

// Wildcard routes MUST come last (/:id matches anything)
router.get('/:id', getShipmentById);
router.post('/:id/updates', updateShipmentTracking);
router.put('/:id/updates', updateShipmentTracking); // Add PUT to match frontend calls in ShipmentDetails.tsx
router.post('/:id/assign', requireAdmin, assignOperator);

export default router;
