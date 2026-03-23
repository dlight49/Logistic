import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { CreateShipmentSchema, UpdateTrackingSchema, AssignOperatorSchema } from '../validators/shipment.validator.js';
import { NotificationService } from '../services/notificationService.js';
import { QuoteService } from '../services/quote.service.js';

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

        if (req.user?.role === 'operator') {
            where.operator_id = req.user.id;
        }

        const shipments = await prisma.shipment.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });

        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
};

export const getShipmentById = async (req: Request, res: Response) => {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { id: req.params.id },
            include: { tracking_updates: { orderBy: { timestamp: 'desc' } } }
        });
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
};

export const getMyShipments = async (req: Request, res: Response) => {
    try {
        const shipments = await prisma.shipment.findMany({
            where: { receiver_email: req.user?.email },
            include: { tracking_updates: { orderBy: { timestamp: 'desc' } } }
        });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your shipments' });
    }
};

export const createShipment = async (req: Request, res: Response) => {
    try {
        const data = CreateShipmentSchema.parse(req.body);
        const status = req.body.status || 'Pending';
        const id = `GS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const shipment = await prisma.shipment.create({
            data: {
                id,
                ...data,
                status: status,
                tracking_updates: {
                    create: { status: status, location: data.sender_city, notes: status === 'Draft' ? 'Shipment draft created' : 'Order received' }
                }
            }
        });
        res.json(shipment);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};

export const createQuote = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const userId = req.user?.id || req.user?.email || 'anonymous';
        const quote = await QuoteService.createQuote(userId, data);
        res.json(quote);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getPendingQuotes = async (req: Request, res: Response) => {
    try {
        const quotes = await QuoteService.getAllQuotes();
        res.json(quotes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const approveQuote = async (req: Request, res: Response) => {
    try {
        const shipment = await QuoteService.approveQuote(req.params.id);
        res.json({ success: true, shipment_id: shipment.id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const rejectQuote = async (req: Request, res: Response) => {
    try {
        await QuoteService.rejectQuote(req.params.id);
        res.json({ success: true });
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

        // Check if shipment exists
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId }
        });
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Validate operator role
        const operator = await prisma.user.findUnique({
            where: { id: operator_id }
        });
        if (!operator || operator.role !== 'operator') {
            return res.status(400).json({ error: 'Invalid operator ID' });
        }

        // Update shipment and tracking
        await prisma.shipment.update({
            where: { id: shipmentId },
            data: { 
                operator_id,
                status: 'Assigned',
                tracking_updates: {
                    create: {
                        status: 'Assigned',
                        location: 'Sorting Center',
                        notes: `Shipment assigned to operator: ${operator.name}`
                    }
                }
            }
        });

        // Notify operator
        await NotificationService.notifyUser(
            operator.id,
            `New shipment assigned: ${shipmentId}`,
            'Assignment',
            shipmentId
        );

        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
};
