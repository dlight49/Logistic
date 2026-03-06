"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTicket = exports.replyToTicket = exports.getTicketById = exports.getAllTickets = exports.getMyTickets = exports.createTicket = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
const notificationService_js_1 = require("../services/notificationService.js");
const createTicket = async (req, res) => {
    try {
        const { subject, text, priority } = req.body;
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const ticketRef = db_1.db.collection('supportTickets').doc();
        const ticketData = {
            user_id: userId,
            subject,
            priority: priority || 'MEDIUM',
            status: 'OPEN',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const messageRef = ticketRef.collection('messages').doc();
        const messageData = {
            sender_id: userId,
            text,
            timestamp: new Date(),
        };
        await db_1.db.runTransaction(async (transaction) => {
            transaction.set(ticketRef, ticketData);
            transaction.set(messageRef, messageData);
        });
        res.status(201).json({ id: ticketRef.id, ...ticketData });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createTicket = createTicket;
const getMyTickets = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const snapshot = await db_1.db.collection('supportTickets')
            .where('user_id', '==', userId)
            // .orderBy('createdAt', 'desc') // Note: requires composite index in production
            .get();
        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMyTickets = getMyTickets;
const getAllTickets = async (req, res) => {
    try {
        if (req.user?.role !== 'admin')
            return res.status(403).json({ error: 'Forbidden' });
        const snapshot = await db_1.db.collection('supportTickets')
            .orderBy('createdAt', 'desc')
            .get();
        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllTickets = getAllTickets;
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketDoc = await db_1.db.collection('supportTickets').doc(id).get();
        if (!ticketDoc.exists)
            return res.status(404).json({ error: 'Ticket not found' });
        const ticketData = ticketDoc.data();
        // Authorization check
        if (req.user?.role !== 'admin' && ticketData.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const messagesSnapshot = await db_1.db.collection('supportTickets').doc(id).collection('messages')
            .orderBy('timestamp', 'asc')
            .get();
        const messages = messagesSnapshot.docs.map(doc => doc.data());
        res.json({ id: ticketDoc.id, ...ticketData, messages });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTicketById = getTicketById;
const replyToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const senderId = req.user?.id;
        if (!senderId)
            return res.status(401).json({ error: 'Unauthorized' });
        const ticketDoc = await db_1.db.collection('supportTickets').doc(id).get();
        if (!ticketDoc.exists)
            return res.status(404).json({ error: 'Ticket not found' });
        const ticketData = ticketDoc.data();
        // Authorization check
        if (req.user?.role !== 'admin' && ticketData.user_id !== senderId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const messageRef = db_1.db.collection('supportTickets').doc(id).collection('messages').doc();
        const messageData = {
            sender_id: senderId,
            text,
            timestamp: new Date()
        };
        await messageRef.set(messageData);
        res.status(201).json(messageData);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.replyToTicket = replyToTicket;
const closeTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketDoc = await db_1.db.collection('supportTickets').doc(id).get();
        if (!ticketDoc.exists)
            return res.status(404).json({ error: 'Ticket not found' });
        const ticketData = ticketDoc.data();
        // Only admin or the owner can close
        if (req.user?.role !== 'admin' && ticketData.user_id !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await db_1.db.collection('supportTickets').doc(id).update({
            status: 'CLOSED',
            updatedAt: new Date()
        });
        res.json({ success: true });
        if (req.user?.role === 'admin' && ticketData.user_id !== req.user?.id) {
            await notificationService_js_1.NotificationService.notifyUser(ticketData.user_id, `Your support ticket "${ticketData.subject}" has been marked as closed.`);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.closeTicket = closeTicket;
//# sourceMappingURL=tickets.controller.js.map