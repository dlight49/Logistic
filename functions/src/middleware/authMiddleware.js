"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
        return;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await db_1.auth.verifyIdToken(token);
        // Fetch user from Firestore
        const userDoc = await db_1.db.collection('users').doc(decodedToken.uid).get();
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
            await db_1.db.collection('users').doc(decodedToken.uid).set(user);
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
exports.requireAuth = requireAuth;
// Middleware to ensure the authenticated user is an admin
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Requires admin privileges' });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=authMiddleware.js.map