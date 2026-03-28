import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { directMessageSchema } from '../validators/support.validator.js';

export const sendDirectMessage = async (req: Request, res: Response) => {
    try {
        const senderId = req.user?.id;
        if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

        const validation = directMessageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }

        const { receiver_id, text } = validation.data;

        const message = await prisma.directMessage.create({
            data: {
                sender_id: senderId,
                receiver_id,
                text
            }
        });

        res.status(201).json(message);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getConversation = async (req: Request, res: Response) => {
    try {
        const { otherUserId } = req.params;
        const myId = req.user?.id;

        if (!myId) return res.status(401).json({ error: 'Unauthorized' });

        const messages = await prisma.directMessage.findMany({
            where: {
                OR: [
                    { sender_id: myId, receiver_id: otherUserId },
                    { sender_id: otherUserId, receiver_id: myId }
                ]
            },
            orderBy: { timestamp: 'asc' }
        });

        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
