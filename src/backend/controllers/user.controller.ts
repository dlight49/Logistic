import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { firebaseAdmin } from '../config/firebase-admin.js';
import crypto from 'crypto';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';

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
            orderBy: { name: 'asc' }
        });

        res.json(users);
    } catch (error) {
        console.error('[UserController] Error in getUsers:', error);
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
        console.error('[UserController] Error in getAdmins:', error);
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

        // Use provided password or generate a temporary one
        const tempPassword = password && password.trim().length >= 6
            ? password.trim()
            : generateTempPassword();

        // 1. Create Firebase Auth user
        let firebaseUser;
        try {
            firebaseUser = await firebaseAdmin.auth().createUser({
                email,
                password: tempPassword,
                displayName: name,
            });
        } catch (firebaseError: any) {
            if (firebaseError.code === 'auth/email-already-exists') {
                return res.status(409).json({ error: 'A user with this email already exists' });
            }
            throw firebaseError;
        }

        const uid = firebaseUser.uid;

        // 2. Create Firestore user doc
        try {
            await firebaseAdmin.firestore().collection('users').doc(uid).set({
                name,
                email,
                phone: phone || null,
                role,
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
            });
        } catch (firestoreError) {
            await firebaseAdmin.auth().deleteUser(uid).catch(() => {});
            throw firestoreError;
        }

        // 3. Create Prisma User
        try {
            await prisma.user.create({
                data: {
                    id: uid,
                    name,
                    email,
                    phone: phone || null,
                    role,
                },
            });
        } catch (prismaError) {
            await firebaseAdmin.auth().deleteUser(uid).catch(() => {});
            await firebaseAdmin.firestore().collection('users').doc(uid).delete().catch(() => {});
            throw prismaError;
        }

        return res.status(201).json({ 
            id: uid, 
            name, 
            email, 
            role, 
            tempPassword 
        });

    } catch (error: any) {
        console.error('[UserController] Error in createUser:', error);
        return res.status(500).json({ error: error.message || 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const validation = updateUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.format() 
            });
        }

        const updates = validation.data;

        // 1. Sync to Firebase Auth
        const authUpdate: any = {};
        if (updates.name) authUpdate.displayName = updates.name;
        if (updates.email) authUpdate.email = updates.email;

        if (Object.keys(authUpdate).length > 0) {
            await firebaseAdmin.auth().updateUser(id, authUpdate).catch(err => console.warn('Firebase Auth update failed:', err));
        }

        // 2. Sync to Firestore
        const firestoreUpdate: any = {
            ...updates,
            updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        };

        await firebaseAdmin.firestore().collection('users').doc(id).update(firestoreUpdate).catch(err => console.warn('Firestore update failed:', err));

        // 3. Update Prisma
        const updated = await prisma.user.update({
            where: { id },
            data: updates,
        });

        return res.json(updated);
    } catch (error: any) {
        console.error('[UserController] Error in updateUser:', error);
        return res.status(400).json({ error: error.message || 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // 1. Delete from Firebase Auth
        await firebaseAdmin.auth().deleteUser(id).catch(err => console.warn('Firebase Auth delete failed:', err));

        // 2. Delete from Firestore
        await firebaseAdmin.firestore().collection('users').doc(id).delete().catch(err => console.warn('Firestore delete failed:', err));

        // 3. Delete from Prisma
        await prisma.user.delete({ where: { id } });

        res.json({ success: true });
    } catch (error: any) {
        console.error('[UserController] Error in deleteUser:', error);
        res.status(500).json({ error: error.message });
    }
};

export const resetUserPassword = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newPassword = generateTempPassword();

        await firebaseAdmin.auth().updateUser(id, { password: newPassword });

        res.json({ tempPassword: newPassword });
    } catch (error: any) {
        console.error('[UserController] Error in resetUserPassword:', error);
        res.status(500).json({ error: error.message });
    }
};
