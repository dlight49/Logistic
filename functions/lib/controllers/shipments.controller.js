import { ShipmentService } from '../services/shipment.service.js';
import { db } from '../config/db.js';
import { CreateShipmentSchema, UpdateTrackingSchema, AssignOperatorSchema } from '../validators/shipment.validator.js';
import { NotificationService } from '../services/notificationService.js';
export const getShipments = async (req, res) => {
    try {
        const { status, sender_country, receiver_country, type, operator_id } = req.query;
        const filters = {};
        if (status)
            filters.status = String(status);
        if (sender_country)
            filters.sender_country = String(sender_country);
        if (receiver_country)
            filters.receiver_country = String(receiver_country);
        if (type)
            filters.type = String(type);
        if (operator_id)
            filters.operator_id = String(operator_id);
        // If role is operator, they can only see their own assigned shipments
        if (req.user?.role === 'operator') {
            filters.operator_id = req.user.id;
        }
        const shipments = await ShipmentService.getShipments(filters);
        res.json(shipments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while fetching shipments' });
    }
};
export const getMyShipments = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'customer') {
            return res.status(403).json({ error: 'Only customers can view their shipments this way.' });
        }
        const snapshot = await db.collection('shipments')
            .where('receiver_email', '==', req.user.email)
            .orderBy('created_at', 'desc')
            .get();
        const shipments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(shipments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while fetching your shipments' });
    }
};
export const getShipmentById = async (req, res) => {
    try {
        const shipmentId = req.params.id;
        const shipment = await ShipmentService.getShipmentById(shipmentId);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        res.json(shipment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
};
export const createShipment = async (req, res) => {
    try {
        const data = CreateShipmentSchema.parse(req.body);
        const id = `GS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await ShipmentService.createShipment({
            id,
            ...data,
            status: 'Order Created'
        });
        res.status(201).json({ id });
    }
    catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
export const createQuote = async (req, res) => {
    try {
        const { origin, destination, weight, speed } = req.body;
        const base = 50;
        const w = parseFloat(weight) || 1;
        const mult = speed === "Express" ? 2 : speed === "Priority" ? 3 : 1;
        const calculatedPrice = base + (w * 5 * mult);
        const id = `GS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await ShipmentService.createShipment({
            id,
            sender_city: origin,
            sender_country: 'US', // Default or from body
            receiver_city: destination,
            receiver_country: 'Global', // Default
            weight: w,
            type: speed,
            status: 'Quote Pending',
            description: 'Quote request',
            estimated_cost: calculatedPrice,
            receiver_email: req.user?.email,
            sender_name: 'System Quote',
            sender_address: 'System',
            receiver_name: req.user?.name || 'Guest',
            receiver_address: destination
        });
        res.status(201).json({ id, estimated_cost: calculatedPrice });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const updateShipmentTracking = async (req, res) => {
    try {
        const { status, location, notes } = UpdateTrackingSchema.parse(req.body);
        const shipmentId = req.params.id;
        const shipment = await ShipmentService.getShipmentById(shipmentId);
        if (!shipment)
            return res.status(404).json({ error: 'Shipment not found' });
        if (req.user?.role === 'operator' && shipment.operator_id !== req.user.id) {
            return res.status(403).json({ error: 'You are not assigned to this shipment' });
        }
        await ShipmentService.updateTracking(shipmentId, { status, location, notes });
        // Trigger notification
        if (shipment.receiver_email) {
            const userSnapshot = await db.collection('users').where('email', '==', shipment.receiver_email).limit(1).get();
            if (!userSnapshot.empty) {
                const user = userSnapshot.docs[0];
                await NotificationService.notifyUser(user.id, `Your shipment ${shipmentId} is now: ${status}. Current location: ${location || 'N/A'}`, `Shipment update: ${shipmentId}`, shipmentId);
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
export const getLiveLocations = async (req, res) => {
    try {
        const operators = await ShipmentService.getLiveOperators();
        res.json(operators.map((op) => ({
            id: `OP-${op.id}`,
            lat: op.current_lat,
            lng: op.current_lng,
            location: op.city || "Route",
            driver: op.name,
            status: "Active"
        })));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch live locations' });
    }
};
export const assignOperator = async (req, res) => {
    try {
        const { operator_id } = AssignOperatorSchema.parse(req.body);
        const shipmentId = req.params.id;
        await ShipmentService.assignOperator(shipmentId, operator_id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
//# sourceMappingURL=shipments.controller.js.map