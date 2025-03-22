import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Hero() {
    const [query, setQuery] = useState('');
    const [businesses, setBusinesses] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://homeservices-production.up.railway.app/api/businesses")
            .then(res => setBusinesses(res.data))
            .catch(err => console.error('Error fetching businesses:', err));
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setFiltered([]);
            setShowDropdown(false);
            return;
        }

        const results = businesses.filter(business => 
            business.name.toLowerCase().includes(value.toLowerCase())
        );

        setFiltered(results);
        setShowDropdown(true);
    };

    const handleSelect = (id) => {
        navigate(`/details/${id}`);
        setQuery('');
        setShowDropdown(false);
    };

    return (
        <div className="flex flex-col items-center justify-center pt-14 pb-7 gap-3 relative">
            <h2 className="font-bold text-[46px] text-center leading-tight">
                Find <span className="text-primary">Home Services & Repair</span>
                <br /> Near You
            </h2>
            <h2 className="text-gray-500 text-lg">Explore the best home services around you</h2>

            {/* Search Box */}
            <div className="relative w-full max-w-md mt-4 z-50 ">
                <div className="flex items-center bg-white border-gray-100 shadow-lg rounded-full px-4 py-2 transition-all duration-300 border-2 border-transparent focus-within:border-primary">
                    <Search className="h-5 w-5 text-gray-500 mr-2" />
                    <input 
                        type="search" 
                        placeholder="Search for a business..." 
                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        value={query}
                        onChange={handleSearch}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                </div>

              
                {showDropdown && filtered.length > 0 && (
                    <ul className="absolute w-full mt-2 bg-white bg-opacity-90 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden max-h-60 overflow-y-auto border border-gray-200">
                        {filtered.map(business => (
                            <li 
                                key={business._id} 
                                className="px-4 py-3 text-gray-700 hover:bg-primary hover:text-white cursor-pointer transition-all duration-200"
                                onMouseDown={() => handleSelect(business._id)}
                            >
                                {business.name}
                            </li>
                        ))}
                    </ul>
                )}

            </div>
        </div>
    );
}

export default Hero;
