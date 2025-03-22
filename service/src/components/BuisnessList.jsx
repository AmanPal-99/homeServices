import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image } from '@unpic/react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

function BusinessList() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("https://homeservices-production.up.railway.app/api/businesses")
            .then(res => {
                setBusinesses(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching businesses:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <div className="mt-8 mb-8 px-4 py-4">
            <h2 className="font-bold text-3xl text-gray-800 mb-6">Popular Businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {businesses.map((business) => (
                    <div
                        key={business._id}
                        className="group relative hover:scale-[1.02] bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary transition-transform duration-300"
                    >
                        {business.imageUrl ? (
                            <Image
                                src={business.imageUrl}
                                alt={business.name}
                                width={400}
                                height={250}
                                loading='lazy'
                                className="h-[200px] object-cover w-full"
                            />
                        ) : (
                            <img
                                src="/userlogo.png"
                                alt="User"
                                className="w-32 h-32  border-4 border-primary object-cover"
                            />
                        )}

                        <div className="py-2 px-2">
                            <span className="text-xs font-medium uppercase bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{business.category}</span>
                            <h2 className="text-2xl font-semibold text-gray-900 my-1 mx-1">{business.name}</h2>
                            <p className="text-gray-500 text-md mx-1">{business.address}</p>

                            <div className="mt-2">
                                <Button
                                    className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-opacity-90 transition-all"
                                    onClick={() => navigate(`/details/${business._id}`)}
                                >
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BusinessList;
