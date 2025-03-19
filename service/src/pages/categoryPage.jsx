import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Image } from '@unpic/react';
import { Button } from '@/components/ui/Button';
import categories from '@/data/categories.json';
import { motion } from 'framer-motion';

function CategoryBusinessPage() {
    
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || categories.categories[0].name);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/api/businesses")
            .then(res => {
                setBusinesses(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching businesses:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory);
        }
    }, [urlCategory]);

    useEffect(() => {
        setFilteredBusinesses(
            businesses.filter(business => business.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase())
        );
    }, [selectedCategory, businesses]);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        navigate(`/category/${categoryName}`);
    };


    return (
        <div className="flex px-0">
            
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/5 sm:w-1/10 border-r p-4 sticky top-16 h-screen overflow-auto shadow-lg bg-gray-50"
            >
                <h2 className="font-bold text-xl mb-4 text-gray-800">Categories</h2>
                <ul className="space-y-2">
                    {categories.categories.map((category) => (
                        <motion.li
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-gray-700 hover:bg-primary hover:text-white transition-all ${selectedCategory === category.name ? "bg-primary text-white" : ""}`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <img src={category.icon.url} alt={category.name} className="w-5 h-5" />
                            {category.name}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Business Grid */}
            <div className="flex-1 px-6 ">
                <h2 className="font-bold text-2xl text-gray-800 mb-6 mt-3">{selectedCategory} Businesses</h2>

                {loading ? (
                    <motion.div
                        className="flex justify-center items-center h-64"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
                    </motion.div>
                ) : filteredBusinesses.length === 0 ? (
                    <p className="text-center text-gray-500">No businesses found.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredBusinesses.map((business) => (
                            <motion.div
                                key={business._id}
                                whileHover={{ scale: 1.03 }}
                                className="group relative bg-white shadow-lg  hover:shadow-primary rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <Image
                                    src={business.imageUrl}
                                    alt={business.name}
                                    width={500}
                                    height={300}
                                    loading='lazy'
                                    className="h-[200px] object-cover w-full"
                                />
                                <div className="py-2 px-2">
                                    <span className="text-xs font-medium uppercase bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{business.category}</span>
                                    <h2 className="text-2xl font-semibold text-gray-900 my-1 mx-1">{business.name}</h2>
                                    <p className="text-gray-500 text-sm mx-1">{business.address}</p>


                                    <div className="mt-2 ">
                                        <Button className="w-full  bg-primary text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-opacity-90 transition-all
                                        " onClick={() => navigate(`/details/${business._id}`)}>
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default CategoryBusinessPage;
