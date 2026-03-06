import { db } from '../config/db.js';
export const getOperators = async (req, res) => {
    try {
        const snapshot = await db.collection('users').where('role', '==', 'operator').get();
        const operators = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Match the frontend's expected shape "assignedShipments" instead of generic "shipments"
        const formatted = operators.map((op) => ({
            ...op,
            assignedShipments: [] // In Firestore, we would fetch these separately if needed
        }));
        res.json(formatted);
    }
    catch (error) {
        console.error('Error fetching operators:', error);
        res.status(500).json({ error: 'Internal server error while fetching operators' });
    }
};
export const createOperator = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const operatorRef = db.collection('users').doc();
        await operatorRef.set({
            name,
            email,
            phone,
            role: 'operator',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json({ id: operatorRef.id });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const updateOperator = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const id = req.params.id;
        await db.collection('users').doc(id).update({
            name,
            email,
            phone,
            updatedAt: new Date(),
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=operators.controller.js.map