"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const db_js_1 = require("../config/db.js");
const resend_1 = require("resend");
// Initialize Resend with env variable (or fallback to empty for dev)
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_placeholder_123');
class ResendEmailProvider {
    async send(payload) {
        if (payload.type !== 'EMAIL')
            return false;
        try {
            // Find the user's email in Firestore
            const userDoc = await db_js_1.db.collection('users').doc(payload.userId).get();
            if (!userDoc.exists || !userDoc.data()?.email) {
                console.error(`User ${payload.userId} not found or has no email address`);
                return false;
            }
            const email = userDoc.data()?.email;
            console.log(`[RESEND] Sending email to ${email}: ${payload.subject}`);
            const { error } = await resend.emails.send({
                from: 'Lumin Logistics <notifications@resend.dev>', // Resend verified domain required for prod
                to: email,
                subject: payload.subject || 'Shipment Update',
                html: `<p>${payload.message}</p><br/><strong>Lumin Logistics Team</strong>`,
            });
            if (error) {
                console.error("[RESEND ERROR]", error);
                return false;
            }
            return true;
        }
        catch (err) {
            console.error("[RESEND EXCEPTION]", err);
            return false;
        }
    }
}
const activeProvider = new ResendEmailProvider();
class NotificationService {
    static async notify(payload) {
        // 1. Log the notification in Firestore
        let logId = null;
        try {
            const logRef = await db_js_1.db.collection('notifications').add({
                user_id: payload.userId,
                shipment_id: payload.shipmentId || null,
                channel: payload.type,
                message: payload.message,
                status: 'PENDING',
                timestamp: new Date()
            });
            logId = logRef.id;
        }
        catch (err) {
            console.error("Failed to log notification init:", err);
        }
        // 2. Actually "send" it via provider
        const success = await activeProvider.send(payload);
        // 3. Update log status
        if (logId) {
            try {
                await db_js_1.db.collection('notifications').doc(logId).update({
                    status: success ? 'SENT' : 'FAILED'
                });
            }
            catch (err) {
                console.error("Failed to update notification log:", err);
            }
        }
        return success;
    }
    static async notifyAdmin(message, metadata) {
        const adminsSnapshot = await db_js_1.db.collection('users').where('role', '==', 'admin').get();
        for (const doc of adminsSnapshot.docs) {
            await this.notify({
                userId: doc.id,
                type: 'EMAIL',
                subject: 'Admin Operations Alert',
                message,
                metadata
            });
        }
    }
    static async notifyUser(userId, message, subject, shipmentId) {
        return await this.notify({
            userId,
            type: 'EMAIL',
            subject: subject || 'Logistics Update',
            message,
            shipmentId
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map