import { Router } from 'express';
import authRoutes from './auth.routes.js';
import shipmentsRoutes from './shipments.routes.js';
import operatorsRoutes from './operators.routes.js';
import usersRoutes from './user.routes.js';
import statsRoutes from './stats.routes.js';
import ticketsRoutes from './tickets.routes.js';
import messagesRoutes from './messages.routes.js';
import miscRoutes from './misc.routes.js';
import shiftsRoutes from './shifts.routes.js';

const router = Router();

router.use('/', authRoutes);
router.use('/shipments', shipmentsRoutes);
router.use('/operators', operatorsRoutes);
router.use('/users', usersRoutes);
router.use('/stats', statsRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/chat', messagesRoutes);
router.use('/shifts', shiftsRoutes);
router.use('/', miscRoutes);

export default router;
