import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { CreateShipmentSchema, UpdateTrackingSchema, AssignOperatorSchema } from '../validators/shipment.validator.js';
import { NotificationService } from '../services/notificationService.js';

export const getShipments = async (req: Request, res: Response) => {
    try {
        const { status, start_date, end_date, sender_country, receiver_country, type, operator_id } = req.query;
        const where: any = {};

        if (status) where.status = String(status);
        if (start_date) where.created_at = { gte: new Date(String(start_date)) };
        if (end_date) where.created_at = { ...where.created_at, lte: new Date(`${String(end_date)}T23:59:59Z`) };
        if (sender_country) where.sender_country = String(sender_country);
        if (receiver_country) where.receiver_country = String(receiver_country);
        if (type) where.type = String(type);
        if (operator_id) where.operator_id = String(operator_id);

        // If role is operator, they can only see their own assigned shipments
        if (req.user?.role === 'operator') {
            where.operator_id = req.user.id;
        }

        const shipments = await prisma.shipment.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });

        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching shipments' });
    }
};

export const getMyShipments = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'customer') {
            return res.status(403).json({ error: 'Only customers can view their shipments this way.' });
        }

        const shipments = await prisma.shipment.findMany({
            where: { receiver_email: req.user.email },
            orderBy: { created_at: 'desc' }
        });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching your shipments' });
    }
};

export const getShipmentById = async (req: Request, res: Response) => {
    try {
        const shipmentId = req.params.id;
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId },
            include: {
                tracking_updates: { orderBy: { timestamp: 'desc' } },
                customs_docs: true
            }
        });

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Role check: an operator shouldn't view another operator's shipment ideally,
        // but leaving it open if they are just tracking, assuming `id` acts like a secure tracking hash.
        res.json({
            ...shipment,
            updates: shipment.tracking_updates,
            docs: shipment.customs_docs
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
};

export const createShipment = async (req: Request, res: Response) => {
    try {
        const data = CreateShipmentSchema.parse(req.body);
        const id = `GS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const shipment = await prisma.shipment.create({
            data: {
                id,
                ...data,
                status: 'Order Created',
                tracking_updates: {
                    create: {
                        status: 'Order Created',
                        location: `${data.sender_city}, ${data.sender_country}`,
                        notes: 'Shipment information received'
                    }
                }
            }
        });

        res.status(201).json({ id: shipment.id });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

export const createQuote = async (req: Request, res: Response) => {
    try {
        const { origin, destination, weight, speed } = req.body;

        // Mock backend calculation logic
        const base = 50;
        const w = parseFloat(weight) || 1;
        const mult = speed === "Express" ? 2 : speed === "Priority" ? 3 : 1;
        const calculatedPrice = base + (w * 5 * mult);

        const id = `GS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const shipment = await prisma.shipment.create({
            data: {
                id,
                sender_city: origin,
                receiver_city: destination,
                weight: w,
                type: speed,
                status: 'Quote Pending',
                estimated_cost: calculatedPrice,
                receiver_email: req.user?.email, // Keep track of who requested
                tracking_updates: {
                    create: {
                        status: 'Quote Pending',
                        location: origin,
                        notes: 'Quote requested'
                    }
                }
            }
        });

        res.status(201).json({ id: shipment.id, estimated_cost: calculatedPrice });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateShipmentTracking = async (req: Request, res: Response) => {
    try {
        const { status, location, notes } = UpdateTrackingSchema.parse(req.body);
        const shipmentId = req.params.id;

        const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

        if (req.user?.role === 'operator' && shipment.operator_id !== req.user.id) {
            return res.status(403).json({ error: 'You are not assigned to this shipment' });
        }

        await prisma.shipment.update({
            where: { id: shipmentId },
            data: {
                status,
                tracking_updates: {
                    create: { status, location, notes }
                }
            }
        });

        // Trigger notification
        if (shipment.receiver_email) {
            const user = await prisma.user.findFirst({ where: { email: shipment.receiver_email } });
            if (user) {
                await NotificationService.notifyUser(
                    user.id,
                    `Your shipment ${shipmentId} is now: ${status}. Current location: ${location || 'N/A'}`,
                    `Shipment update: ${shipmentId}`
                );
            }
        }

        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

export const getLiveLocations = async (req: Request, res: Response) => {
    try {
        const operators = await prisma.user.findMany({
            where: {
                role: 'operator',
                current_lat: { not: null },
                current_lng: { not: null }
            },
            select: {
                id: true,
                name: true,
                current_lat: true,
                current_lng: true,
                shipments: {
                    where: { status: { in: ['In Transit', 'Out for Delivery'] } },
                    select: { id: true, status: true, receiver_city: true },
                    take: 1
                }
            }
        });

        res.json(operators.map(op => ({
            id: op.shipments[0]?.id || `OP-${op.id}`,
            lat: op.current_lat,
            lng: op.current_lng,
            location: op.shipments[0]?.receiver_city || "Unknown",
            driver: op.name,
            status: op.shipments[0]?.status || "Active"
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch live locations' });
    }
};

export const assignOperator = async (req: Request, res: Response) => {
    try {
        const { operator_id } = AssignOperatorSchema.parse(req.body);
        const shipmentId = req.params.id;

        await prisma.shipment.update({
            where: { id: shipmentId },
            data: { operator_id }
        });

        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
