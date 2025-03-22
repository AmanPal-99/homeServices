import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/Button';
import { NotebookPen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Image } from '@unpic/react';
import { motion } from 'framer-motion';
import BookingSec from './BookingSec';
  

function Suggestions({ business }) {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);

    useEffect(() => {
        axios.get("https://homeservices-production.up.railway.app/api/businesses")
            .then(res => {
                setBusinesses(res.data);
            })
            .catch(err => {
                console.error('Error fetching businesses:', err);
            });
    }, []);

    useEffect(() => {
        if (business?.category && businesses.length > 0) {
            setFilteredBusinesses(
                businesses.filter(b => b.category.trim().toLowerCase() === business?.category.trim().toLowerCase() && b._id !== business._id) 
            );
        }
    }, [businesses, business?.category , business?._id]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="md:pl-8"
        >
            
            <BookingSec>
                <Button className="flex   lg:gap-2 w-full mb-4">
                    <NotebookPen className='hidden lg:block' />Book a Service
                </Button>
            </BookingSec>

            <div className="border border-primary rounded-md p-4 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-50 shadow-lg max-h-[650px] overflow-y-auto hidden md:block">
                <h2 className="font-bold text-lg mb-3">Similar Businesses</h2>
                <div>
                    {filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((b) => (
                            <motion.div 
                                key={b._id} 
                                onClick={() => navigate(`/details/${b._id}`)} 
                                className="flex gap-2  flex-col lg:flex-row p-3 rounded-lg hover:bg-purple-300 transition cursor-pointer hover:shadow-md"
                                whileHover={{ scale: 1.03 }}
                            >
                                <Image
                                    src={b.imageUrl}
                                    alt={b.name}
                                    height={80}
                                    width={80}
                                    className="rounded-lg object-cover h-[80px] shadow-sm"
                                />
                                <div>
                                    <h2 className="font-bold">{b.name}</h2>
                                    <h2 className="text-gray-600">{b.address}</h2>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-500">No similar businesses found.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default Suggestions;
