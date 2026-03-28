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
        logger.info(`[AUTH] Registration attempt for email: ${email}`);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            logger.warn(`[AUTH] Registration failed: Email ${email} already in use`);
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                role: 'customer'
                // Default settings could be added here
            }
        });

        logger.info(`[AUTH] User registered successfully: ${user.id}`);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({ user, token });

    } catch (error: any) {
        logger.error(`[AUTH] Critical registration error for ${req.body.email}: ${error.message}`, { 
            stack: error.stack,
            body: req.body 
        });
        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        logger.info(`[AUTH] Login attempt for email: ${email}`);

        // 1. Development login bypass (ONLY in dev, ONLY for specific hostnames)
        const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
        if (process.env.NODE_ENV === 'development' && isLocalhost && password === 'local-dev-bypass') {
            const user = await prisma.user.findUnique({ where: { email } });
            if (user) {
                logger.info(`[AUTH] Successful Dev-Bypass login for ${email}`);
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET || 'dev_secret',
                    { expiresIn: '30d' }
                );
                return res.json({ user, token });
            }
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            logger.warn(`[AUTH] Login failed: User not found or has no password set for ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Diagnostic Logging for Password Hashing
        const hashPrefix = user.password.substring(0, 7);
        const hashLength = user.password.length;
        logger.debug(`[AUTH] Diagnostic: Comparing password (len: ${password.length}) with hash (prefix: ${hashPrefix}, len: ${hashLength}) for ${email}`);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn(`[AUTH] Login failed: Password mismatch for ${email}. Hash Type: ${hashPrefix}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        logger.info(`[AUTH] Successful login for ${email} (Role: ${user.role})`);

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
