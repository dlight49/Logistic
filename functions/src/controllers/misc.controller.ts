import type { Request, Response } from 'express';
import { db } from '../config/db.js';
import { FieldValue } from 'firebase-admin/firestore';

// ---- Settings Controller ----
export const getSettings = async (req: Request, res: Response) => {
    try {
        const settingsSnapshot = await db.collection('settings').get();
        const settingsObj: any = {};
        settingsSnapshot.forEach(doc => {
            const data = doc.data();
            settingsObj[doc.id] = data.value === 'true';
        });
        res.json(settingsObj);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const updates = req.body;
        const batch = db.batch();

        Object.entries(updates).forEach(([key, value]) => {
            const docRef = db.collection('settings').doc(key);
            batch.set(docRef, { value: String(value) }, { merge: true });
        });

        await batch.commit();
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

export const getNotificationLogs = async (req: Request, res: Response) => {
    try {
        const logsSnapshot = await db.collection('notificationLogs')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();
        
        const logs = logsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(logs);
    } catch (err) {
        console.error('Error fetching notification logs:', err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

// ---- Docs Controller ----
export const uploadDoc = async (req: Request, res: Response) => {
    try {
        const { doc_type, file_url } = req.body;
        const shipmentId = req.params.id;

        const docData = {
            shipment_id: shipmentId,
            doc_type,
            file_url: file_url || "https://example.com/mock-doc.pdf",
            status: 'pending',
            uploaded_at: FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('customsDocs').add(docData);

        res.status(201).json({ success: true, id: docRef.id });
    } catch (error: any) {
        console.error('Error uploading doc:', error);
        res.status(400).json({ error: error.message });
    }
};

export const updateDocStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const docId = req.params.id as string;

        await db.collection('customsDocs').doc(docId).update({ status });

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error updating doc status:', error);
        res.status(400).json({ error: error.message });
    }
};
