import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

// ---- Settings Controller ----
export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.setting.findMany();
        const settingsObj = settings.reduce((acc: any, s: any) => {
            acc[s.key] = s.value === 'true';
            return acc;
        }, {});
        res.json(settingsObj);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const updates = req.body;

        // Prisma upsert or transaction for multiple updates
        const promises = Object.entries(updates).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });

        await prisma.$transaction(promises);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

export const getNotificationLogs = async (req: Request, res: Response) => {
    try {
        const page   = Math.max(1, parseInt(String(req.query.page  || '1')));
        const limit  = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '20'))));
        const skip   = (page - 1) * limit;
        const channel = req.query.channel as string | undefined;
        const status  = req.query.status  as string | undefined;

        const where: any = {};
        if (channel) where.channel = channel;
        if (status)  where.status  = status;

        const [logs, total] = await prisma.$transaction([
            prisma.notificationLog.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                skip,
                take: limit
            }),
            prisma.notificationLog.count({ where })
        ]);

        res.json({ logs, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

// ---- Docs Controller ----
export const uploadDoc = async (req: Request, res: Response) => {
    try {
        const { doc_type, file_url } = req.body;
        const shipmentId = req.params.id;

        await prisma.customsDoc.create({
            data: {
                shipment_id: shipmentId,
                doc_type,
                file_url: file_url || "https://example.com/mock-doc.pdf",
                status: 'pending',
                uploaded_at: new Date()
            }
        });

        res.status(201).json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateDocStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const docId = Number(req.params.id);

        await prisma.customsDoc.update({
            where: { id: docId },
            data: { status }
        });

        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
