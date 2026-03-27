import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';
import logger from '../utils/logger.js';

/** Generate a random 12-char alphanumeric password */
function generateTempPassword(): string {
    return crypto.randomBytes(9).toString('base64url').slice(0, 12);
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        const where: any = {};
        if (role) where.role = String(role);

        const users = await prisma.user.findMany({
            where,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                current_lat: true,
                current_lng: true
            }
        });

        res.json(users);
    } catch (error) {
        logger.error('[UserController] Error in getUsers:', { error });
        res.status(500).json({ error: 'Internal server error while fetching users' });
    }
};

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true, name: true, email: true }
        });
        res.json(admins);
    } catch (error) {
        logger.error('[UserController] Error in getAdmins:', { error });
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        // Strict Validation
        const validation = createUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.format() 
            });
        }

        const { name, email, phone, password, role } = validation.data;

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
                role: role || 'customer',
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json({ 
            user: userWithoutPassword, 
            tempPassword: password ? undefined : tempPassword,
        });

    } catch (error: any) {
        logger.error('[UserController] Error in createUser:', { error: error.message || error });
        return res.status(500).json({ error: error.message || 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        const updates: any = { ...validation.data };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updates
        });

        const { password: _, ...userWithoutPassword } = updated;
        return res.json(userWithoutPassword);
    } catch (error: any) {
        logger.error('[UserController] Error in updateUser:', { error: error.message || error });
        return res.status(400).json({ error: error.message || 'Failed to update user' });
    }
};

export const updateSelf = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id;
        if (!id) return res.status(401).json({ error: 'Unauthorized' });

        const validation = updateUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        const updates: any = { ...validation.data };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updates
        });

        const { password: _, ...userWithoutPassword } = updated;
        return res.json(userWithoutPassword);
    } catch (error: any) {
        logger.error('[UserController] Error in updateSelf:', { error: error.message || error });
        return res.status(400).json({ error: error.message || 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Delete from Prisma
        await prisma.user.delete({ where: { id } });

        res.json({ success: true });
    } catch (error: any) {
        logger.error('[UserController] Error in deleteUser:', { error: error.message || error });
        res.status(500).json({ error: error.message });
    }
};

export const resetUserPassword = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        res.json({ tempPassword: newPassword });
    } catch (error: any) {
        logger.error('[UserController] Error in resetUserPassword:', { error: error.message || error });
        res.status(500).json({ error: error.message });
    }
};
