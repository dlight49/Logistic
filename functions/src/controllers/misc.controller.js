"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocStatus = exports.uploadDoc = exports.getNotificationLogs = exports.updateSettings = exports.getSettings = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
const firestore_1 = require("firebase-admin/firestore");
// ---- Settings Controller ----
const getSettings = async (req, res) => {
    try {
        const settingsSnapshot = await db_1.db.collection('settings').get();
        const settingsObj = {};
        settingsSnapshot.forEach(doc => {
            const data = doc.data();
            settingsObj[doc.id] = data.value === 'true';
        });
        res.json(settingsObj);
    }
    catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        const batch = db_1.db.batch();
        Object.entries(updates).forEach(([key, value]) => {
            const docRef = db_1.db.collection('settings').doc(key);
            batch.set(docRef, { value: String(value) }, { merge: true });
        });
        await batch.commit();
        res.json({ success: true });
    }
    catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
const getNotificationLogs = async (req, res) => {
    try {
        const logsSnapshot = await db_1.db.collection('notificationLogs')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();
        const logs = logsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(logs);
    }
    catch (err) {
        console.error('Error fetching notification logs:', err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};
exports.getNotificationLogs = getNotificationLogs;
// ---- Docs Controller ----
const uploadDoc = async (req, res) => {
    try {
        const { doc_type, file_url } = req.body;
        const shipmentId = req.params.id;
        const docData = {
            shipment_id: shipmentId,
            doc_type,
            file_url: file_url || "https://example.com/mock-doc.pdf",
            status: 'pending',
            uploaded_at: firestore_1.FieldValue.serverTimestamp()
        };
        const docRef = await db_1.db.collection('customsDocs').add(docData);
        res.status(201).json({ success: true, id: docRef.id });
    }
    catch (error) {
        console.error('Error uploading doc:', error);
        res.status(400).json({ error: error.message });
    }
};
exports.uploadDoc = uploadDoc;
const updateDocStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const docId = req.params.id;
        await db_1.db.collection('customsDocs').doc(docId).update({ status });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error updating doc status:', error);
        res.status(400).json({ error: error.message });
    }
};
exports.updateDocStatus = updateDocStatus;
//# sourceMappingURL=misc.controller.js.map