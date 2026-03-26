import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_development_secret_key_change_me_in_prod';

// Extend Express Request object to include the authenticated user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }

    try {
        const decodedPayload = jwt.verify(token, JWT_SECRET) as any;
        
        const user = await prisma.user.findUnique({
            where: { id: decodedPayload.id },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error: any) {
        logger.error('[AUTH] JWT verification failed:', { error: error.message });
        res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Requires admin privileges' });
    }
    next();
};

export const requireOperator = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'operator' && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Requires operator privileges' });
    }
    next();
};
