import { useState } from "react";
import { apiFetch } from "../utils/api";

export function useShipmentActions() {
    const [updating, setUpdating] = useState<string | null>(null);

    const handleStatusUpdate = async (id: string, status: string, city?: string) => {
        setUpdating(id);
        try {
            await apiFetch(`/api/shipments/${id}/updates`, {
                method: "POST",
                body: JSON.stringify({
                    status,
                    location: city || "Current Location",
                    notes: `Status updated to ${status} via Quick Action`
                })
            });
            // Update the shipment's main status too if the API doesn't do it automatically
            // (Most implementations update the main status when a new 'update' record is added)
            return true;
        } catch (err) {
            console.error(`Failed to update shipment ${id}:`, err);
            return false;
        } finally {
            setUpdating(null);
        }
    };

    const handleNavigate = (address: string) => {
        if (!address) return;
        const encodedAddress = encodeURIComponent(address);
        const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        window.open(url, "_blank");
    };

    return {
        updating,
        handleStatusUpdate,
        handleNavigate
    };
}
