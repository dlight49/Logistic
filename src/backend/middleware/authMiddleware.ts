import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import logger from '../utils/logger.js';

/**
 * PRODUCTION AUTH MIDDLEWARE (Neon Auth Compatible)
 * 
 * This middleware verifies tokens using the database.
 * Since Neon Auth and the Data API share the same session store, 
 * we can verify a session directly via SQL.
 */
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
        // 1. Check Neon Auth Session table
        const session = await prisma.$queryRaw`
            SELECT s.user_id, u.email, u.name 
            FROM "neon_auth"."session" s
            JOIN "neon_auth"."user" u ON s.user_id = u.id
            WHERE s.token = ${token} AND s.expires_at > NOW()
            LIMIT 1
        ` as any[];

        if (!session || session.length === 0) {
            // FALLBACK: Check if it's a legacy native JWT (useful during transition)
            // But for a fresh Neon Auth start, we expect the token in the session table.
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
        }

        const authUser = session[0];

        // 2. Map Neon Auth User to our Logistics Public User (Roles, etc.)
        let user = await prisma.user.findUnique({
            where: { email: authUser.email },
        });

        // 3. Auto-Provision Profile in Public Schema if missing
        if (!user) {
            logger.info(`[AUTH] Auto-provisioning profile for Neon user: ${authUser.email}`);
            user = await prisma.user.create({
                data: {
                    id: authUser.user_id,
                    email: authUser.email,
                    name: authUser.name,
                    password: 'NEON_AUTH_MANAGED', // No local password needed
                    role: 'customer' // Default role for new signups
                }
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error: any) {
        logger.error('[AUTH] Neon Session verification failed:', { error: error.message });
        res.status(401).json({ error: 'Unauthorized: Session verification failed' });
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
