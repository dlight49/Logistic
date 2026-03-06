import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { firebaseAdmin } from '../config/firebase-admin.js';

export const getGlobalStats = async (req: Request, res: Response) => {
    try {
        const total = await prisma.shipment.count();
        const inTransit = await prisma.shipment.count({ where: { status: 'In Transit' } });
        const inCustoms = await prisma.shipment.count({ where: { status: 'Held by Customs' } });
        const issues = await prisma.shipment.count({ where: { status: 'Delayed' } });
        const delivered = await prisma.shipment.count({ where: { status: 'Delivered' } });
        const activeTickets = await prisma.supportTicket.count({ where: { status: 'OPEN' } });
        const fleetMessages = await prisma.directMessage.count();
        
        // Count quotes from local database
        const quotes = await prisma.shipment.count({ 
            where: { status: 'Quote Pending' } 
        });

        res.json({
            total,
            inTransit,
            inCustoms,
            issues,
            delivered,
            activeTickets,
            fleetMessages,
            quotes
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch global stats' });
    }
};

export const getDriverStats = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Optional Role verification checking if auth correctly matches the ID they want stats for
        if (req.user?.role === 'operator' && req.user.id !== id) {
            return res.status(403).json({ error: 'Forbidden. You can only view your own stats.' });
        }

        const active = await prisma.shipment.count({
            where: {
                operator_id: id,
                status: { notIn: ['Delivered', 'Cancelled'] }
            }
        });

        const pending = await prisma.shipment.count({
            where: { operator_id: id, status: 'Order Created' }
        });

        const done = await prisma.shipment.count({
            where: { operator_id: id, status: 'Delivered' }
        });

        res.json({ active, pending, done });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch driver stats' });
    }
};
