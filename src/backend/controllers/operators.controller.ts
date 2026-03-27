import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import logger from '../utils/logger.js';

/** Generate a random 12-char alphanumeric password */
function generateTempPassword(): string {
    return crypto.randomBytes(9).toString('base64url').slice(0, 12);
}

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
        logger.error('[getOperators] Error:', error);
        res.status(500).json({ error: 'Internal server error while fetching operators' });
    }
};

export const createOperator = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'A user with this email already exists' });
        }

        // Use provided password or generate a temporary one
        const tempPassword = password && password.trim().length >= 6
            ? password.trim()
            : generateTempPassword();

        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        // Create Prisma User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                role: 'operator',
            },
        });

        // Return credentials (password shown exactly once)
        res.status(201).json({
            id: user.id,
            email: user.email,
            tempPassword: password ? undefined : tempPassword,
        });
    } catch (error: any) {
        logger.error('[createOperator] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to create operator' });
    }
};

export const updateOperator = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;
        const id = req.params.id;

        const updates: any = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (phone !== undefined) updates.phone = phone || null;
        if (password) updates.password = await bcrypt.hash(password, 12);

        // Update Prisma
        const updated = await prisma.user.update({
            where: { id },
            data: updates,
        });

        res.json({ success: true });
    } catch (error: any) {
        logger.error('[updateOperator] Error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const deleteOperator = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // 1. Verify the user exists and is an operator
        const operator = await prisma.user.findFirst({
            where: { id, role: 'operator' },
        });

        if (!operator) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        // 2. Unassign all shipments currently assigned to this operator
        const unassigned = await prisma.shipment.updateMany({
            where: { operator_id: id },
            data: { operator_id: null },
        });

        logger.info(`[deleteOperator] Unassigned ${unassigned.count} shipment(s) from operator ${id}`);

        // 3. Delete the user record from the database
        await prisma.user.delete({ where: { id } });

        res.json({ 
            success: true,
            message: `Operator deleted. ${unassigned.count} shipment(s) returned to unassigned pool.`
        });
    } catch (error: any) {
        logger.error('[deleteOperator] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete operator' });
    }
};

export const resetOperatorPassword = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Verify the user exists and is an operator
        const user = await prisma.user.findFirst({
            where: { id, role: 'operator' },
        });

        if (!user) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        // Generate new password and update
        const newPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        res.json({ tempPassword: newPassword });
    } catch (error: any) {
        logger.error('[resetOperatorPassword] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
};
