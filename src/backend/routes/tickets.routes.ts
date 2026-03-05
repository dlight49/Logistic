import { Router } from 'express';
import { createTicket, getMyTickets, getAllTickets, getTicketById, replyToTicket, closeTicket } from '../controllers/tickets.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/my', getMyTickets);
router.post('/', createTicket);
router.get('/:id', getTicketById);
router.post('/:id/reply', replyToTicket);
router.post('/:id/close', closeTicket);

// Admin only
router.get('/admin/all', requireAdmin, getAllTickets);

export default router;
