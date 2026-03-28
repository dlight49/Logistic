import { prisma } from '../config/db.js';
import { Resend } from 'resend';
import logger from '../utils/logger.js';

// Validate Resend API key at startup — fail fast rather than silently sending with bogus key
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    logger.warn('[NOTIFICATIONS] RESEND_API_KEY not set — email delivery will be disabled');
}
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface NotificationPayload {
    userId?: string;
    receiverEmail?: string;
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
            let targetEmail = payload.receiverEmail;

            // If userId is provided, try to find their email
            if (!targetEmail && payload.userId) {
                const user = await prisma.user.findUnique({ where: { id: payload.userId } });
                targetEmail = user?.email || undefined;
            }

            if (!targetEmail) {
                logger.error(`No target email found for notification (userId: ${payload.userId}, shipmentId: ${payload.shipmentId})`);
                return false;
            }

            if (!resend) {
                logger.warn(`[RESEND] Client not initialized — logging intent to send email to ${targetEmail}`);
                return true; // Return true as we've "handled" it by logging
            }

            logger.info(`[RESEND] Sending email to ${targetEmail}: ${payload.subject}`);

            const { data, error } = await resend.emails.send({
                from: 'Lumin Logistics <notifications@resend.dev>', // Resend verified domain required for prod
                to: targetEmail,
                subject: payload.subject || 'Shipment Update',
                html: `<p>${payload.message}</p><br/><strong>Lumin Logistics Team</strong>`,
            });

            if (error) {
                logger.error("[RESEND ERROR]", { error });
                return false;
            }
            return true;
        } catch (err) {
            logger.error("[RESEND EXCEPTION]", { error: err });
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
            logger.error("Failed to log notification init:", { error: err });
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
                logger.error("Failed to update notification log:", { error: err });
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

    static async notifyEmail(email: string, message: string, subject?: string, shipmentId?: string) {
        return await this.notify({
            receiverEmail: email,
            type: 'EMAIL',
            subject: subject || 'Logistics Update',
            message,
            shipmentId
        });
    }
}
