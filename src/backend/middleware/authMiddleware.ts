import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase-admin.js';
import { prisma } from '../config/db.js';

// Extend Express Request object to include the authenticated user
declare global {
    namespace Express {
        interface Request {
            user?: any; // Define a more strict type based on your Prisma User model later
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
        return;
    }

    const token = authHeader.split('Bearer ')[1];

    // Development-only mock bypass — NEVER runs in production
    // if (process.env.NODE_ENV !== 'production' && token === 'mock-token') {
    //     const mockUserId = req.headers['mock-user-id'] as string;
    //     if (mockUserId) {
    //         const user = await prisma.user.findUnique({ where: { id: mockUserId } });
    //         if (user) {
    //             console.warn(`[AUTH] Mock-token bypass used for user ${mockUserId}`);
    //             req.user = user;
    //             return next();
    //         }
    //     }
    // }

    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        // Find or create the user in our local database based on Firebase UID
        let user = await prisma.user.findUnique({
            where: { id: decodedToken.uid },
        });

        if (!user) {
            // Fallback check by email (in case user existed before UID migration)
            user = await prisma.user.findUnique({
                where: { email: decodedToken.email },
            });

            if (user) {
                // Update existing user with their new Firebase UID
                user = await prisma.user.update({
                    where: { email: decodedToken.email },
                    data: { id: decodedToken.uid }
                });
            } else {
                // Auto-create user if they don't exist yet
                user = await prisma.user.create({
                    data: {
                        id: decodedToken.uid,
                        email: decodedToken.email,
                        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown',
                        role: 'customer', // Default role for new signups
                    }
                });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Middleware to ensure the authenticated user is an admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Requires admin privileges' });
        return;
    }
    next();
};
