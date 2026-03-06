"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversation = exports.sendDirectMessage = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
const firestore_1 = require("firebase-admin/firestore");
const sendDirectMessage = async (req, res) => {
    try {
        const { receiver_id, text } = req.body;
        const senderId = req.user?.id;
        if (!senderId)
            return res.status(401).json({ error: 'Unauthorized' });
        const messageData = {
            sender_id: senderId,
            receiver_id,
            text,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        };
        const docRef = await db_1.db.collection('messages').add(messageData);
        res.status(201).json({ id: docRef.id, ...messageData });
    }
    catch (error) {
        console.error('Error sending direct message:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.sendDirectMessage = sendDirectMessage;
const getConversation = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const myId = req.user?.id;
        if (!myId)
            return res.status(401).json({ error: 'Unauthorized' });
        const messagesSnapshot = await db_1.db.collection('messages')
            .where(firestore_1.Filter.or(firestore_1.Filter.and(firestore_1.Filter.where('sender_id', '==', myId), firestore_1.Filter.where('receiver_id', '==', otherUserId)), firestore_1.Filter.and(firestore_1.Filter.where('sender_id', '==', otherUserId), firestore_1.Filter.where('receiver_id', '==', myId))))
            .orderBy('timestamp', 'asc')
            .get();
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getConversation = getConversation;
//# sourceMappingURL=messages.controller.js.map