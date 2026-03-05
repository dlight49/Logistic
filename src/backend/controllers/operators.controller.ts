import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getOperators = async (req: Request, res: Response) => {
    try {
        const operators = await prisma.user.findMany({
            where: { role: 'operator' },
            include: {
                shipments: {
                    select: { id: true, status: true }
                }
            }
        });

        // Match the frontend's expected shape "assignedShipments" instead of generic "shipments"
        const formatted = operators.map(op => ({
            ...op,
            assignedShipments: op.shipments
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching operators' });
    }
};

export const createOperator = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;
        const id = Math.random().toString(36).substring(2, 10);

        // Note: with Firebase Auth, the true source of auth is Firebase.
        // In production, you would probably create a Firebase user here too using Admin SDK.
        const newOp = await prisma.user.create({
            data: {
                id,
                name,
                email,
                phone,
                role: 'operator'
            }
        });

        res.status(201).json({ id: newOp.id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateOperator = async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        const id = req.params.id;

        await prisma.user.updateMany({
            where: { id, role: 'operator' },
            data: { name, email, phone }
        });

        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
