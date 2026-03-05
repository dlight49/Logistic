import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const sendDirectMessage = async (req: Request, res: Response) => {
    try {
        const { receiver_id, text } = req.body;
        const senderId = req.user?.id;

        if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

        const message = await (prisma as any).directMessage.create({
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

        const messages = await (prisma as any).directMessage.findMany({
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
