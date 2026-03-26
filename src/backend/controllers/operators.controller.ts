import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { firebaseAdmin } from '../config/firebase-admin.js';
import crypto from 'crypto';

/** Generate a random 12-char alphanumeric password */
function generateTempPassword(): string {
    return crypto.randomBytes(9).toString('base64url').slice(0, 12);
}

export const getOperators = async (req: Request, res: Response) => {
    try {
        const operators = await prisma.user.findMany({
            where: { role: 'operator' },
            include: {
                shipments: {
                    select: { id: true, status: true }
                }
            }
        });

        // Match the frontend's expected shape "assignedShipments" instead of generic "shipments"
        const formatted = operators.map(op => ({
            ...op,
            assignedShipments: op.shipments
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching operators' });
    }
};

export const createOperator = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email) {
            res.status(400).json({ error: 'Name and email are required' });
            return;
        }

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
            // Handle common Firebase errors with user-friendly messages
            if (firebaseError.code === 'auth/email-already-exists') {
                res.status(409).json({ error: 'A user with this email already exists in Firebase Auth' });
                return;
            }
            if (firebaseError.code === 'auth/invalid-email') {
                res.status(400).json({ error: 'Invalid email address format' });
                return;
            }
            if (firebaseError.code === 'auth/invalid-password') {
                res.status(400).json({ error: 'Password must be at least 6 characters' });
                return;
            }
            throw firebaseError;
        }

        const uid = firebaseUser.uid;

        // 2. Create Firestore user doc (used by DriverLogin for role check)
        try {
            await firebaseAdmin.firestore().collection('users').doc(uid).set({
                name,
                email,
                phone: phone || null,
                role: 'operator',
                createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
            });
        } catch (firestoreError) {
            // Rollback: delete the Firebase Auth user if Firestore fails
            console.error('[createOperator] Firestore write failed, rolling back Auth user:', firestoreError);
            await firebaseAdmin.auth().deleteUser(uid).catch(() => {});
            throw firestoreError;
        }

        // 3. Create Prisma User with Firebase UID as the ID
        try {
            await prisma.user.create({
                data: {
                    id: uid,
                    name,
                    email,
                    phone: phone || null,
                    role: 'operator',
                },
            });
        } catch (prismaError) {
            // Rollback: delete Firebase Auth user + Firestore doc
            console.error('[createOperator] Prisma write failed, rolling back:', prismaError);
            await firebaseAdmin.auth().deleteUser(uid).catch(() => {});
            await firebaseAdmin.firestore().collection('users').doc(uid).delete().catch(() => {});
            throw prismaError;
        }

        // Return credentials (password shown exactly once)
        res.status(201).json({
            id: uid,
            email,
            tempPassword,
        });
    } catch (error: any) {
        console.error('[createOperator] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to create operator' });
    }
};

export const updateOperator = async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        const id = req.params.id;

        // 1. Sync changes to Firebase Auth
        const authUpdate: Record<string, string> = {};
        if (name) authUpdate.displayName = name;
        if (email) authUpdate.email = email;

        if (Object.keys(authUpdate).length > 0) {
            try {
                await firebaseAdmin.auth().updateUser(id, authUpdate);
            } catch (firebaseError: any) {
                if (firebaseError.code === 'auth/user-not-found') {
                    console.warn(`[updateOperator] Firebase Auth user ${id} not found — updating local only`);
                } else {
                    throw firebaseError;
                }
            }
        }

        // 2. Sync changes to Firestore user doc
        const firestoreUpdate: Record<string, any> = {};
        if (name) firestoreUpdate.name = name;
        if (email) firestoreUpdate.email = email;
        if (phone !== undefined) firestoreUpdate.phone = phone || null;

        if (Object.keys(firestoreUpdate).length > 0) {
            try {
                await firebaseAdmin.firestore().collection('users').doc(id).update(firestoreUpdate);
            } catch (firestoreError) {
                console.warn(`[updateOperator] Firestore update for ${id} failed:`, firestoreError);
            }
        }

        // 3. Update Prisma
        await prisma.user.updateMany({
            where: { id, role: 'operator' },
            data: { name, email, phone },
        });

        res.json({ success: true });
    } catch (error: any) {
        console.error('[updateOperator] Error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const deleteOperator = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // 1. Verify the user exists and is an operator
        const operator = await prisma.user.findFirst({
            where: { id, role: 'operator' },
        });

        if (!operator) {
            res.status(404).json({ error: 'Operator not found' });
            return;
        }

        // 2. Unassign all shipments currently assigned to this operator
        //    (set operator_id to null so shipments are not lost)
        const unassigned = await prisma.shipment.updateMany({
            where: { operator_id: id },
            data: { operator_id: null },
        });

        console.log(`[deleteOperator] Unassigned ${unassigned.count} shipment(s) from operator ${id}`);

        // 3. Delete the user record from the database
        await prisma.user.delete({ where: { id } });

        res.json({ 
            success: true,
            message: `Operator deleted. ${unassigned.count} shipment(s) returned to unassigned pool.`
        });
    } catch (error: any) {
        console.error('[deleteOperator] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete operator' });
    }
};

export const resetOperatorPassword = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Verify the user exists and is an operator
        const user = await prisma.user.findFirst({
            where: { id, role: 'operator' },
        });

        if (!user) {
            res.status(404).json({ error: 'Operator not found' });
            return;
        }

        // Generate new password and update Firebase Auth
        const newPassword = generateTempPassword();

        try {
            await firebaseAdmin.auth().updateUser(id, { password: newPassword });
        } catch (firebaseError: any) {
            if (firebaseError.code === 'auth/user-not-found') {
                res.status(404).json({ error: 'Firebase Auth user not found — this driver may need to be re-created' });
                return;
            }
            throw firebaseError;
        }

        res.json({ tempPassword: newPassword });
    } catch (error: any) {
        console.error('[resetOperatorPassword] Error:', error);
        res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
};
