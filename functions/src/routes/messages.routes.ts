import { Router } from 'express';
import { sendDirectMessage, getConversation } from '../controllers/messages.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/:otherUserId', getConversation);
router.post('/send', sendDirectMessage);

export default router;
