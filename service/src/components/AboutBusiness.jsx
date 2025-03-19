import { Image } from "@unpic/react";
import React from "react";

function AboutBusiness({ business }) {
    return business && (
        <div className="">
            <h2 className="font-bold text-3xl">Description</h2>
            <p className="mt-4 text-lg text-gray-700">{business.about}</p>

        
            {business.gallery?.length > 0 && (
                <>
                    <h2 className="font-bold text-3xl mt-8">Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gradient-to-br from-purple-200 via-purple-100 to-purple-50 border border-primary rounded-lg shadow-md">
                        {business.gallery.map((img, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={img}
                                    alt={`Gallery ${index}`}
                                    height={200}
                                    width={300}
                                    className="rounded-lg shadow-md w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AboutBusiness;
