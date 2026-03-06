interface NotificationPayload {
    userId: string;
    type: 'EMAIL' | 'SMS' | 'PUSH';
    subject?: string;
    message: string;
    shipmentId?: string;
    metadata?: any;
}
export declare class NotificationService {
    static notify(payload: NotificationPayload): Promise<boolean>;
    static notifyAdmin(message: string, metadata?: any): Promise<void>;
    static notifyUser(userId: string, message: string, subject?: string, shipmentId?: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=notificationService.d.ts.map