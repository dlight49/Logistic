import { Request, Response } from 'express';
import { db } from '../config/db';

export const getGlobalStats = async (req: Request, res: Response) => {
    try {
        const shipmentsCol = db.collection('shipments');
        
        const total = (await shipmentsCol.count().get()).data().count;
        const inTransit = (await shipmentsCol.where('status', '==', 'In Transit').count().get()).data().count;
        const inCustoms = (await shipmentsCol.where('status', '==', 'Held by Customs').count().get()).data().count;
        const issues = (await shipmentsCol.where('status', '==', 'Delayed').count().get()).data().count;
        const delivered = (await shipmentsCol.where('status', '==', 'Delivered').count().get()).data().count;

        res.json({
            total,
            inTransit,
            inCustoms,
            issues,
            delivered
        });
    } catch (error: any) {
        console.error('Error fetching global stats:', error);
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

        const shipmentsCol = db.collection('shipments');

        const active = (await shipmentsCol
            .where('operator_id', '==', id)
            .where('status', 'not-in', ['Delivered', 'Cancelled'])
            .count().get()).data().count;

        const pending = (await shipmentsCol
            .where('operator_id', '==', id)
            .where('status', '==', 'Order Created')
            .count().get()).data().count;

        const done = (await shipmentsCol
            .where('operator_id', '==', id)
            .where('status', '==', 'Delivered')
            .count().get()).data().count;

        res.json({ active, pending, done });
    } catch (error: any) {
        console.error('Error fetching driver stats:', error);
        res.status(500).json({ error: 'Failed to fetch driver stats' });
    }
};
