import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    logger.error('[AUTH] FATAL: JWT_SECRET environment variable is not set!');
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                role: 'customer'
            }
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        logger.error('[AUTH] Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // === LOCAL DEVELOPMENT BYPASS ===
        // If testing locally, accept ANY password and ANY email.
        if (process.env.NODE_ENV !== 'production' && (req.hostname === 'localhost' || req.hostname === '127.0.0.1')) {
            let devUser = await prisma.user.findUnique({ where: { email } });
            
            // If the email they typed doesn't exist, just grab the first admin account
            if (!devUser) {
                devUser = await prisma.user.findFirst({ where: { role: 'admin' } });
            }

            if (devUser) {
                logger.info(`[AUTH] Development bypass used for local testing. Logging in as ${devUser.email}`);
                const token = jwt.sign(
                    { id: devUser.id, email: devUser.email, role: devUser.role },
                    JWT_SECRET || 'dev_secret',
                    { expiresIn: '7d' }
                );
                const { password: _, ...userWithoutPassword } = devUser;
                res.json({ user: userWithoutPassword, token });
                return;
            }
        }
        // ================================

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            logger.warn(`[AUTH] Login failed: User not found or has no password set for ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`[AUTH] Invalid password for user: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!JWT_SECRET) {
            logger.error('[AUTH] Cannot sign token: JWT_SECRET is missing');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;
        logger.info(`[AUTH] User logged in successfully: ${email}`);
        res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
        logger.error('[AUTH] Login exception:', { error: error.message, stack: error.stack });
        // Put the specific error in the main 'error' field so the frontend shows it
        res.status(500).json({ 
            error: `Internal Error: ${error.message}`
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    // req.user is set by authMiddleware
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
};
