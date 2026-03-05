import { useEffect, useRef } from "react";
import { useAuth } from "../features/auth/AuthContext";

/**
 * useDriverTracking
 * Custom hook to track driver's GPS location and sync with backend
 * Throttles updates to prevent excessive battery/data usage.
 */
export function useDriverTracking() {
    const { user } = useAuth();
    const lastSyncRef = useRef<number>(0);
    const syncInterval = 60000; // Sync every 60 seconds

    useEffect(() => {
        if (!user || user.role !== "operator") return;

        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const now = Date.now();
                if (now - lastSyncRef.current < syncInterval) return;

                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch('/api/driver/location', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('lumin_token')}`
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            lat: latitude,
                            lng: longitude
                        })
                    });

                    if (response.ok) {
                        lastSyncRef.current = now;
                        console.log(`[Tracking] Synced location: ${latitude}, ${longitude}`);
                    }
                } catch (err) {
                    console.error("[Tracking] Failed to sync driver location", err);
                }
            },
            (error) => {
                console.error("[Tracking] Geolocation error", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [user]);
}
