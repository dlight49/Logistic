import { useEffect, useRef } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { apiFetch } from "../utils/api";

/**
 * useDriverTracking
 * Custom hook to track driver's GPS location and sync with backend
 * Throttles updates to prevent excessive battery/data usage.
 */
export function useDriverTracking() {
    const { user } = useAuth();
    const lastSyncRef = useRef<number>(0);
    const syncInterval = 30000; // Sync every 30 seconds for better real-time accuracy

    useEffect(() => {
        if (!user || user.role !== "operator") return;

        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                if (!navigator.onLine) {
                    console.warn("[Tracking] Device is offline. Skipping sync.");
                    return;
                }

                const now = Date.now();
                if (now - lastSyncRef.current < syncInterval) return;

                const { latitude, longitude } = position.coords;

                try {
                    const response = await apiFetch('/api/driver/location', {
                        method: 'PUT',
                        body: JSON.stringify({
                            userId: user.id,
                            lat: latitude,
                            lng: longitude
                        })
                    });

                    if (response.ok) {
                        lastSyncRef.current = now;
                    } else {
                        throw new Error(`Server responded with ${response.status}`);
                    }
                } catch (err) {
                    console.error("[Tracking] Sync failed. Will retry on next movement.", err);
                }
            },
            (error) => {
                console.error("[Tracking] Geolocation error", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 15000, // Reduced for better accuracy
                timeout: 20000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [user]);
}
