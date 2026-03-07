import { Router } from 'express';
import { createTicket, getMyTickets, getAllTickets, getTicketById, replyToTicket, closeTicket } from '../controllers/tickets.controller.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

// Static routes FIRST
router.get('/my', getMyTickets);
router.post('/', createTicket);

// Admin only
router.get('/admin/all', requireAdmin, getAllTickets);

// Parameterized routes LAST (/:id matches anything)
router.get('/:id', getTicketById);
router.post('/:id/reply', replyToTicket);
router.post('/:id/close', closeTicket);

export default router;
