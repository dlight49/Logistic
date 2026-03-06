import { db } from '../config/db.js';

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

export class ShipmentService {
    private static COLLECTION = 'shipments';

    static async getShipments(filters: any = {}) {
        let query: any = db.collection(this.COLLECTION);

        if (filters.status) query = query.where('status', '==', filters.status);
        if (filters.sender_country) query = query.where('sender_country', '==', filters.sender_country);
        if (filters.receiver_country) query = query.where('receiver_country', '==', filters.receiver_country);
        if (filters.type) query = query.where('type', '==', filters.type);
        if (filters.operator_id) query = query.where('operator_id', '==', filters.operator_id);

        const snapshot = await query.orderBy('created_at', 'desc').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }

    static async getShipmentById(id: string) {
        const doc = await db.collection(this.COLLECTION).doc(id).get();
        if (!doc.exists) return null;

        const data = doc.data();
        const updatesSnapshot = await db.collection(this.COLLECTION).doc(id).collection('updates').orderBy('timestamp', 'desc').get();
        const updates = updatesSnapshot.docs.map((uDoc: any) => uDoc.data());

        return { ...data, id: doc.id, updates };
    }

    static async createShipment(data: any) {
        const shipmentId = data.id;
        const batch = db.batch();

        const shipmentRef = db.collection(this.COLLECTION).doc(shipmentId);
        batch.set(shipmentRef, {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        });

        const updateRef = shipmentRef.collection('updates').doc();
        batch.set(updateRef, {
            status: data.status,
            location: `${data.sender_city}, ${data.sender_country}`,
            notes: 'Shipment information received',
            timestamp: new Date()
        });

        await batch.commit();
        return { id: shipmentId };
    }

    static async updateTracking(id: string, update: any) {
        const shipmentRef = db.collection(this.COLLECTION).doc(id);
        const batch = db.batch();

        batch.update(shipmentRef, {
            status: update.status,
            updated_at: new Date()
        });

        const updateRef = shipmentRef.collection('updates').doc();
        batch.set(updateRef, {
            ...update,
            timestamp: new Date()
        });

        await batch.commit();
    }

    static async assignOperator(id: string, operator_id: string) {
        await db.collection(this.COLLECTION).doc(id).update({
            operator_id,
            updated_at: new Date()
        });
    }

    static async getLiveOperators() {
        const snapshot = await db.collection('users')
            .where('role', '==', 'operator')
            .where('current_lat', '!=', null)
            .get();
        
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
}
