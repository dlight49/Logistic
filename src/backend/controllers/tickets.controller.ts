import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { NotificationService } from '../services/notificationService.js';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { subject, text, priority } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const ticket = await prisma.supportTicket.create({
            data: {
                user_id: userId,
                subject,
                priority: priority || 'MEDIUM',
                messages: {
                    create: {
                        sender_id: userId,
                        text
                    }
                }
            },
            include: { messages: true }
        });

        res.status(201).json(ticket);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyTickets = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const tickets = await prisma.supportTicket.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });

        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const tickets = await prisma.supportTicket.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { created_at: 'desc' }
        });

        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTicketById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ticket = await prisma.supportTicket.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { timestamp: 'asc' } },
                user: { select: { name: true, email: true } }
            }
        });

        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Authorization check
        if (req.user?.role !== 'admin' && ticket.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json(ticket);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const replyToTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const senderId = req.user?.id;

        if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Authorization check
        if (req.user?.role !== 'admin' && ticket.user_id !== senderId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const message = await prisma.ticketMessage.create({
            data: {
                ticket_id: id,
                sender_id: senderId,
                text
            }
        });

        res.status(201).json(message);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const closeTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Only admin or the owner can close
        if (req.user?.role !== 'admin' && ticket.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await prisma.supportTicket.update({
            where: { id },
            data: { status: 'CLOSED' }
        });

        res.json({ success: true });

        if (req.user?.role === 'admin' && ticket.user_id !== req.user?.id) {
            await NotificationService.notifyUser(ticket.user_id, `Your support ticket "${ticket.subject}" has been marked as closed.`);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
