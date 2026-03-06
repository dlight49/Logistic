import type { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/db.js';

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
        res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
        return;
    }

    const token = authHeader.split('Bearer ')[1] as string;

    try {
        const decodedToken = await auth.verifyIdToken(token);

        // Fetch user from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        
        let user: any;
        if (!userDoc.exists) {
            // Auto-create user if they don't exist yet
            user = {
                id: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown',
                role: 'customer', // Default role for new signups
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await db.collection('users').doc(decodedToken.uid).set(user);
        } else {
            user = userDoc.data();
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

export const AuthMiddleware = {
    verifyToken: requireAuth,
    requireAdmin: requireAdmin
};
