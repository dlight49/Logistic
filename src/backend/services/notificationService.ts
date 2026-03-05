import { prisma } from '../config/db.js';
import { Resend } from 'resend';

// Initialize Resend with env variable (or fallback to empty for dev)
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_123');

interface NotificationPayload {
    userId: string;
    type: 'EMAIL' | 'SMS' | 'PUSH';
    subject?: string;
    message: string;
    shipmentId?: string;
    metadata?: any;
}

interface NotificationProvider {
    send(payload: NotificationPayload): Promise<boolean>;
}

class ResendEmailProvider implements NotificationProvider {
    async send(payload: NotificationPayload): Promise<boolean> {
        if (payload.type !== 'EMAIL') return false;

        try {
            // Find the user's email if not provided in metadata
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (!user?.email) {
                console.error(`User ${payload.userId} has no email address`);
                return false;
            }

            console.log(`[RESEND] Sending email to ${user.email}: ${payload.subject}`);

            const { data, error } = await resend.emails.send({
                from: 'Lumin Logistics <notifications@resend.dev>', // Resend verified domain required for prod
                to: user.email,
                subject: payload.subject || 'Shipment Update',
                html: `<p>${payload.message}</p><br/><strong>Lumin Logistics Team</strong>`,
            });

            if (error) {
                console.error("[RESEND ERROR]", error);
                return false;
            }
            return true;
        } catch (err) {
            console.error("[RESEND EXCEPTION]", err);
            return false;
        }
    }
}

const activeProvider = new ResendEmailProvider();

export class NotificationService {
    static async notify(payload: NotificationPayload) {
        // 1. Log the notification in the database
        let logId: number | null = null;
        try {
            const log = await prisma.notificationLog.create({
                data: {
                    user_id: payload.userId,
                    shipment_id: payload.shipmentId,
                    channel: payload.type,
                    message: payload.message,
                    status: 'PENDING',
                    timestamp: new Date()
                }
            });
            logId = log.id;
        } catch (err) {
            console.error("Failed to log notification init:", err);
        }

        // 2. Actually "send" it via provider
        const success = await activeProvider.send(payload);

        // 3. Update log status
        if (logId) {
            try {
                await prisma.notificationLog.update({
                    where: { id: logId },
                    data: { status: success ? 'SENT' : 'FAILED' }
                });
            } catch (err) {
                console.error("Failed to update notification log:", err);
            }
        }

        return success;
    }

    static async notifyAdmin(message: string, metadata?: any) {
        const admins = await prisma.user.findMany({ where: { role: 'admin' } });
        for (const admin of admins) {
            await this.notify({
                userId: admin.id,
                type: 'EMAIL',
                subject: 'Admin Operations Alert',
                message,
                metadata
            });
        }
    }

    static async notifyUser(userId: string, message: string, subject?: string, shipmentId?: string) {
        return await this.notify({
            userId,
            type: 'EMAIL',
            subject: subject || 'Logistics Update',
            message,
            shipmentId
        });
    }
}
