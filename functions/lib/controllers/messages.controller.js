import { db } from '../config/db.js';
import { Filter, FieldValue } from 'firebase-admin/firestore';
export const sendDirectMessage = async (req, res) => {
    try {
        const { receiver_id, text } = req.body;
        const senderId = req.user?.id;
        if (!senderId)
            return res.status(401).json({ error: 'Unauthorized' });
        const messageData = {
            sender_id: senderId,
            receiver_id,
            text,
            timestamp: FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('messages').add(messageData);
        res.status(201).json({ id: docRef.id, ...messageData });
    }
    catch (error) {
        console.error('Error sending direct message:', error);
        res.status(500).json({ error: error.message });
    }
};
export const getConversation = async (req, res) => {
    try {
        const otherUserId = req.params.otherUserId;
        const myId = req.user?.id;
        if (!myId)
            return res.status(401).json({ error: 'Unauthorized' });
        const messagesSnapshot = await db.collection('messages')
            .where(Filter.or(Filter.and(Filter.where('sender_id', '==', myId), Filter.where('receiver_id', '==', otherUserId)), Filter.and(Filter.where('sender_id', '==', otherUserId), Filter.where('receiver_id', '==', myId))))
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
//# sourceMappingURL=messages.controller.js.map