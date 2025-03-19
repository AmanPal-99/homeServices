import { Image } from '@unpic/react';
import { Mail, MapPin, PhoneIcon, Share, User } from 'lucide-react';
import React from 'react';
import { Button } from './ui/Button';

function BusinessInfo({ business }) {
    return (
        <div className="flex flex-col  lg:flex-row gap-6 items-center p-6 border border-primary rounded-lg shadow-lg bg-gradient-to-br from-purple-200 via-purple-100 to-purple-50 w-full">

    
            <div className="flex-shrink-0">

                {business.imageUrl ? (
                    < Image
                        src={business.imageUrl}
                        alt={business?.name}
                        height={180}
                        width={180}
                        className="rounded-full h-[100px] sm:h-[140px] md:h-[160px] lg:h-[180px] w-[100px] sm:w-[140px] md:w-[160px] lg:w-[180px] shadow-md object-cover"
                    />
                ) : (
                    <img
                        src="/userlogo.png"
                        alt="User"
                        className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                    />
                )}
            </div>

            <div className="flex flex-col w-full text-center lg:text-left">
                <h2 className="text-white bg-primary p-1 px-4 rounded-full text-base sm:text-lg font-semibold w-fit mx-auto lg:mx-0">
                    {business?.category}
                </h2>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">{business?.name}</h2>
                <h2 className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-lg text-gray-600 mt-1">
                    <MapPin className="text-primary" /> {business?.address}
                </h2>
                <h2 className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-lg text-gray-600">
                    <Mail className="text-primary" /> {business?.email}
                </h2>
            </div>

            
            <div className="flex flex-col gap-4 items-center lg:items-end mt-4 lg:mt-4">
                <Button className="bg-primary text-white hover:bg-opacity-90 transition-all shadow-md flex gap-2 px-4 py-2">
                    <Share className="w-5 h-5" /> Share
                </Button>
                <h2 className="flex items-center gap-2 text-sm sm:text-lg text-gray-600">
                    <PhoneIcon className="text-primary" /> {business?.contact}
                </h2>
                <h2 className="flex items-center gap-2 text-sm sm:text-lg text-gray-600 whitespace-nowrap">
                    <User className="text-primary" /> Available 9:00 AM - 5:00 PM
                </h2>
            </div>
        </div>
    );
}

export default BusinessInfo;
