import React, { ReactNode, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Package, Truck } from "lucide-react";
import { apiFetch } from "../utils/api";

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Trucks
const truckIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center shrink-0 w-8 h-8"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"></path><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path><path d="M14 17h1"></path><circle cx="7.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

export default function LiveDispatchMap(): ReactNode {
    const [activeShipments, setActiveShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLocations = async () => {
        try {
            const res = await apiFetch("/api/shipments/tracking/live");
            if (res.ok) {
                const data = await res.json();
                setActiveShipments(data);
            }
        } catch (err) {
            console.error("Failed to fetch live locations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
        const interval = setInterval(fetchLocations, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel p-4 sm:p-6 rounded-3xl h-[400px] sm:h-[500px] w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <Truck className="w-5 h-5 text-accent" /> Live Global Dispatch
                </h2>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Live
                </span>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-inner relative z-0">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {activeShipments.map((shipment) => (
                        <Marker
                            key={shipment.id}
                            position={[shipment.lat, shipment.lng]}
                            icon={truckIcon}
                        >
                            <Popup className="rounded-xl">
                                <div className="p-1">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">{shipment.id}</h3>
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Package className="w-3 h-3" /> {shipment.location}</p>
                                    <div className="bg-slate-100 p-2 rounded-lg text-xs">
                                        <span className="font-semibold text-slate-700">Driver:</span> {shipment.driver}<br />
                                        <span className="font-semibold text-slate-700">Status:</span> <span className="text-accent font-bold">{shipment.status}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
