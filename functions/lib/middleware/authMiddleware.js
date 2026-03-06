import { auth, db } from '../config/db.js';
export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
        return;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(token);
        // Fetch user from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        let user;
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
        }
        else {
            user = userDoc.data();
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
// Middleware to ensure the authenticated user is an admin
export const requireAdmin = (req, res, next) => {
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
//# sourceMappingURL=authMiddleware.js.map