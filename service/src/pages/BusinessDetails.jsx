import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import BusinessInfo from "@/components/BusinessInfo";
import AboutBusiness from "@/components/AboutBusiness";
import Suggestions from "@/components/Suggestions";
import MapView from "@/components/MapComponent";  
import { motion } from "framer-motion";

const BusinessDetails = () => {
    const { id: businessId } = useParams(); 
    const user = useSelector((state) => state.auth.user);
    const userId = user?._id; 

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/businesses/${businessId}`);
                setBusiness(response.data);
            } catch (err) {
                setError("Business not found");
            } finally {
                setLoading(false);
            }
        };

        fetchBusiness();
    }, [businessId]);

    if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-lg">{error}</div>;

    return business && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-10 px-10 md:px-28 scroll-smooth"
        >
            <BusinessInfo business={business} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:col-span-2"
                >
                    <AboutBusiness business={business} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Suggestions business={business} />
                </motion.div>
            </div>

            <div className="mt-10 px-32">
                <h2 className="text-3xl font-bold">Location</h2>
                {userId && businessId && <MapView userId={userId} businessId={businessId} />}
            </div>
        </motion.div>
    );
};

export default BusinessDetails;
