import axios from "axios";
import Business from "./bSchema.js";
import User from "./userSchema.js";

const geocodeAddress = async (address) => {
    try {
        
        let formattedAddress = address.includes("India") ? address : `${address}, India`;

        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: { q: formattedAddress, format: "json", limit: 1 },
        });

        if (response.data.length === 0) {
            return null;
        }

        ;

        return {
            latitude: parseFloat(response.data[0].lat),
            longitude: parseFloat(response.data[0].lon),
        };
    } catch (error) {
        console.error(`❌ Geocoding failed for: ${address}`, error);
        return null;
    }
};


export const getRoute = async (req, res) => {
    try {
       

        const { userId, businessId } = req.params;

        if (!userId || !businessId) {
           
            return res.status(400).json({ error: "Invalid request parameters" });
        }

      
        let user = await User.findById(userId);

        if (!user) {
           
            user = await Business.findById(userId);
        }

        
        const business = await Business.findById(businessId);

        if (!user) {
           
            return res.status(404).json({ error: "User not found" });
        }
        if (!business) {
           
            return res.status(404).json({ error: "Business not found" });
        }

        const userCoords = await geocodeAddress(user.address);
        const businessCoords = await geocodeAddress(business.address);

        if (!userCoords || !businessCoords) {
            
            return res.status(400).json({ error: "Invalid addresses" });
        }       
        const routeResponse = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${userCoords.longitude},${userCoords.latitude};${businessCoords.longitude},${businessCoords.latitude}?overview=full&geometries=geojson`
        );

        const route = routeResponse.data.routes[0]?.geometry?.coordinates || [];

        res.json({
            userLocation: [userCoords.latitude, userCoords.longitude],
            businessLocation: [businessCoords.latitude, businessCoords.longitude],
            path: route.map(([lon, lat]) => [lat, lon]),
            center: [(userCoords.latitude + businessCoords.latitude) / 2, (userCoords.longitude + businessCoords.longitude) / 2],
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to calculate route" });
    }
};
