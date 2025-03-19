import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { Loader2, AlertTriangle } from "lucide-react"; 


const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34],
});

const MapView = ({ userId, businessId }) => {
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/map/route/${userId}/${businessId}`);
                setRoute(response.data);
            } catch (err) {
                setError("Failed to load your route");
            } finally {
                setLoading(false);
            }
        };
        fetchRoute();
    }, [userId, businessId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
                <span className="ml-2 text-gray-600">Loading map...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center text-red-500 bg-red-100 p-3 rounded-md">
                <AlertTriangle className="mr-2 w-5 h-5" />
                {error}
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 -z-50">
            <MapContainer center={route.center} zoom={13} style={{ height: "400px", width: "100%" }} className="rounded-xl">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <Marker position={route.userLocation} icon={defaultIcon} />
                <Marker position={route.businessLocation} icon={defaultIcon} />
           
                <Polyline positions={route.path} color="blue" weight={5} opacity={0.7} />
            </MapContainer>
        </div>
    );
};

export default MapView;
