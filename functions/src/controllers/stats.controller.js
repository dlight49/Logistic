"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverStats = exports.getGlobalStats = void 0;
const express_1 = require("express");
const db_1 = require("../config/db");
const getGlobalStats = async (req, res) => {
    try {
        const shipmentsCol = db_1.db.collection('shipments');
        const total = (await shipmentsCol.count().get()).data().count;
        const inTransit = (await shipmentsCol.where('status', '==', 'In Transit').count().get()).data().count;
        const inCustoms = (await shipmentsCol.where('status', '==', 'Held by Customs').count().get()).data().count;
        const issues = (await shipmentsCol.where('status', '==', 'Delayed').count().get()).data().count;
        const delivered = (await shipmentsCol.where('status', '==', 'Delivered').count().get()).data().count;
        res.json({
            total,
            inTransit,
            inCustoms,
            issues,
            delivered
        });
    }
    catch (error) {
        console.error('Error fetching global stats:', error);
        res.status(500).json({ error: 'Failed to fetch global stats' });
    }
};
exports.getGlobalStats = getGlobalStats;
const getDriverStats = async (req, res) => {
    try {
        const id = req.params.id;
        // Optional Role verification checking if auth correctly matches the ID they want stats for
        if (req.user?.role === 'operator' && req.user.id !== id) {
            return res.status(403).json({ error: 'Forbidden. You can only view your own stats.' });
        }
        const shipmentsCol = db_1.db.collection('shipments');
        const active = (await shipmentsCol
            .where('operator_id', '==', id)
            .where('status', 'not-in', ['Delivered', 'Cancelled'])
            .count().get()).data().count;
        const pending = (await shipmentsCol
            .where('operator_id', '==', id)
            .where('status', '==', 'Order Created')
            .count().get()).data().count;
        const done = (await shipmentsCol
            .where('operator_id', '==', id)
            .where('status', '==', 'Delivered')
            .count().get()).data().count;
        res.json({ active, pending, done });
    }
    catch (error) {
        console.error('Error fetching driver stats:', error);
        res.status(500).json({ error: 'Failed to fetch driver stats' });
    }
};
exports.getDriverStats = getDriverStats;
//# sourceMappingURL=stats.controller.js.map