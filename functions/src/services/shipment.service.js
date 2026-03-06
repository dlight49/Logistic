"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentService = void 0;
const db_js_1 = require("../config/db.js");
class ShipmentService {
    static COLLECTION = 'shipments';
    static async getShipments(filters = {}) {
        let query = db_js_1.db.collection(this.COLLECTION);
        if (filters.status)
            query = query.where('status', '==', filters.status);
        if (filters.sender_country)
            query = query.where('sender_country', '==', filters.sender_country);
        if (filters.receiver_country)
            query = query.where('receiver_country', '==', filters.receiver_country);
        if (filters.type)
            query = query.where('type', '==', filters.type);
        if (filters.operator_id)
            query = query.where('operator_id', '==', filters.operator_id);
        const snapshot = await query.orderBy('created_at', 'desc').get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    static async getShipmentById(id) {
        const doc = await db_js_1.db.collection(this.COLLECTION).doc(id).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        const updatesSnapshot = await db_js_1.db.collection(this.COLLECTION).doc(id).collection('updates').orderBy('timestamp', 'desc').get();
        const updates = updatesSnapshot.docs.map((uDoc) => uDoc.data());
        return { ...data, id: doc.id, updates };
    }
    static async createShipment(data) {
        const shipmentId = data.id;
        const batch = db_js_1.db.batch();
        const shipmentRef = db_js_1.db.collection(this.COLLECTION).doc(shipmentId);
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
    static async updateTracking(id, update) {
        const shipmentRef = db_js_1.db.collection(this.COLLECTION).doc(id);
        const batch = db_js_1.db.batch();
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
    static async assignOperator(id, operator_id) {
        await db_js_1.db.collection(this.COLLECTION).doc(id).update({
            operator_id,
            updated_at: new Date()
        });
    }
    static async getLiveOperators() {
        const snapshot = await db_js_1.db.collection('users')
            .where('role', '==', 'operator')
            .where('current_lat', '!=', null)
            .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
}
exports.ShipmentService = ShipmentService;
//# sourceMappingURL=shipment.service.js.map