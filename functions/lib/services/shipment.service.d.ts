export interface Shipment {
    id: string;
    sender_name: string;
    sender_email?: string;
    sender_phone?: string;
    sender_address: string;
    sender_city: string;
    sender_country: string;
    receiver_name: string;
    receiver_email?: string;
    receiver_phone?: string;
    receiver_address: string;
    receiver_city: string;
    receiver_country: string;
    type: string;
    weight: number;
    description: string;
    status: string;
    estimated_cost?: number;
    operator_id?: string;
    created_at: Date;
    updated_at: Date;
}
export interface TrackingUpdate {
    status: string;
    location?: string;
    notes?: string;
    timestamp: Date;
}
export declare class ShipmentService {
    private static COLLECTION;
    static getShipments(filters?: any): Promise<any>;
    static getShipmentById(id: string): Promise<{
        id: string;
        updates: any[];
    } | null>;
    static createShipment(data: any): Promise<{
        id: any;
    }>;
    static updateTracking(id: string, update: any): Promise<void>;
    static assignOperator(id: string, operator_id: string): Promise<void>;
    static getLiveOperators(): Promise<any[]>;
}
//# sourceMappingURL=shipment.service.d.ts.map