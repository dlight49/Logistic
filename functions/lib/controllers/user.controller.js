import { db } from '../config/db.js';
export const UserController = {
    updateLocation: async (req, res) => {
        try {
            const { userId, lat, lng } = req.body;
            if (!userId || lat === undefined || lng === undefined) {
                return res.status(400).json({ error: 'Missing required fields: userId, lat, lng' });
            }
            // Update user's last known location in Firestore
            await db.collection('users').doc(userId).update({
                lastLocation: {
                    lat,
                    lng,
                    updatedAt: new Date()
                }
            });
            console.log(`[UserController] Updated location for user ${userId}: ${lat}, ${lng}`);
            return res.status(200).json({ success: true });
        }
        catch (error) {
            console.error('[UserController] Error updating location:', error);
            return res.status(500).json({ error: 'Internal server error while updating location' });
        }
    }
};
//# sourceMappingURL=user.controller.js.map