import { prisma } from '../config/db.js';
import { NotificationService } from './notificationService.js';

export class QuoteService {
    static async createQuote(userId: string, data: any) {
        const { origin, destination, weight, speed, insurance, details } = data;
        
        // Mock backend calculation logic
        const base = 50;
        const w = parseFloat(weight) || 1;
        const mult = speed === "Express" ? 2 : speed === "Priority" ? 3 : 1;
        const calculatedPrice = base + (w * 5 * mult) + (insurance ? 20 : 0);

        const id = `QT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        return await prisma.shipment.create({
            data: {
                id,
                sender_city: origin,
                receiver_city: destination,
                weight: w,
                type: speed,
                status: 'Quote Pending',
                estimated_cost: calculatedPrice,
                insurance_selected: insurance,
                package_details: details,
                receiver_email: userId, // Temporarily using receiver_email to link to user if email isn't available
                tracking_updates: {
                    create: {
                        status: 'Quote Pending',
                        location: origin,
                        notes: 'Quote requested'
                    }
                }
            }
        });
    }

    static async getAllQuotes() {
        return await prisma.shipment.findMany({
            where: { status: 'Quote Pending' },
            orderBy: { created_at: 'desc' }
        });
    }

    static async approveQuote(quoteId: string) {
        const quote = await prisma.shipment.findUnique({
            where: { id: quoteId }
        });

        if (!quote) throw new Error('Quote not found');

        // Convert to shipment: change ID prefix and status
        const newId = quoteId.replace('QT-', 'GS-');
        
        const shipment = await prisma.shipment.update({
            where: { id: quoteId },
            data: {
                id: newId,
                status: 'Order Created',
                tracking_updates: {
                    create: {
                        status: 'Order Approved',
                        location: quote.sender_city,
                        notes: 'Quote approved and converted to shipment'
                    }
                }
            }
        });

        // Notify user if possible
        if (quote.receiver_email) {
            // Find user id by email or just use the field if it was stored as ID
            // For now, assuming standard notification
            console.info(`Notifying user about quote approval: ${quoteId}`);
        }

        return shipment;
    }

    static async rejectQuote(quoteId: string) {
        return await prisma.shipment.update({
            where: { id: quoteId },
            data: { status: 'Quote Rejected' }
        });
    }
}
