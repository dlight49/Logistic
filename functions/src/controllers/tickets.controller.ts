import type { Request, Response } from 'express';
import { db } from '../config/db.js';
import { NotificationService } from '../services/notificationService.js';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { subject, text, priority } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const ticketRef = db.collection('supportTickets').doc();
        const ticketData = {
            user_id: userId,
            subject,
            priority: priority || 'MEDIUM',
            status: 'OPEN',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const messageRef = ticketRef.collection('messages').doc();
        const messageData = {
            sender_id: userId,
            text,
            timestamp: new Date(),
        };

        await db.runTransaction(async (transaction) => {
            transaction.set(ticketRef, ticketData);
            transaction.set(messageRef, messageData);
        });

        res.status(201).json({ id: ticketRef.id, ...ticketData });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyTickets = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const snapshot = await db.collection('supportTickets')
            .where('user_id', '==', userId)
            // .orderBy('createdAt', 'desc') // Note: requires composite index in production
            .get();

        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const snapshot = await db.collection('supportTickets')
            .orderBy('createdAt', 'desc')
            .get();

        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTicketById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const ticketDoc = await db.collection('supportTickets').doc(id).get();

        if (!ticketDoc.exists) return res.status(404).json({ error: 'Ticket not found' });

        const ticketData: any = ticketDoc.data();

        // Authorization check
        if (req.user?.role !== 'admin' && ticketData.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const messagesSnapshot = await db.collection('supportTickets').doc(id).collection('messages')
            .orderBy('timestamp', 'asc')
            .get();

        const messages = messagesSnapshot.docs.map(doc => doc.data());

        res.json({ id: ticketDoc.id, ...ticketData, messages });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const replyToTicket = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { text } = req.body;
        const senderId = req.user?.id;

        if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

        const ticketDoc = await db.collection('supportTickets').doc(id).get();
        if (!ticketDoc.exists) return res.status(404).json({ error: 'Ticket not found' });
        const ticketData: any = ticketDoc.data();

        // Authorization check
        if (req.user?.role !== 'admin' && ticketData.user_id !== senderId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const messageRef = db.collection('supportTickets').doc(id).collection('messages').doc();
        const messageData = {
            sender_id: senderId,
            text,
            timestamp: new Date()
        };

        await messageRef.set(messageData);

        res.status(201).json(messageData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const closeTicket = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const ticketDoc = await db.collection('supportTickets').doc(id).get();
        if (!ticketDoc.exists) return res.status(404).json({ error: 'Ticket not found' });
        const ticketData: any = ticketDoc.data();

        // Only admin or the owner can close
        if (req.user?.role !== 'admin' && ticketData.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await db.collection('supportTickets').doc(id).update({
            status: 'CLOSED',
            updatedAt: new Date()
        });

        res.json({ success: true });

        if (req.user?.role === 'admin' && ticketData.user_id !== req.user?.id) {
            await NotificationService.notifyUser(ticketData.user_id as string, `Your support ticket "${ticketData.subject}" has been marked as closed.`);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
