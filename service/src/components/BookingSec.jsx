import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { toast } from "sonner"

function BookingSec({ children }) {
    const { id } = useParams();
    const user = useSelector((state) => state.auth.user);
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookedSlots, setBookedSlots] = useState(new Map());

    
    const fetchBookedSlots = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bookings/booked-slots/${id}`);
           

            const bookedData = response.data;
            if (!bookedData || typeof bookedData !== "object" || Array.isArray(bookedData)) {
                toast("Unexpected API response format:", bookedData);
                return;
            }

            const formattedSlots = new Map();
            Object.entries(bookedData).forEach(([dateKey, slots]) => {
                const normalizedDate = new Date(dateKey).toISOString().split("T")[0]; // Normalize date
                formattedSlots.set(normalizedDate, slots.map(({ time }) => time));
            });

            setBookedSlots(formattedSlots);
           
        } catch (error) {
            toast("Error fetching booked slots:", error);
        }
    };

    useEffect(() => {
        fetchBookedSlots();
    }, [id]);

   
    const generateTimeSlots = () => {
        const slots = [];
        let hour = 9;
        let minute = 0;
        while (hour < 18 || (hour === 18 && minute === 0)) {
            const formattedTime = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? "00" : minute} ${hour < 12 ? "AM" : "PM"}`;
            slots.push(formattedTime);
            minute += 30;
            if (minute === 60) {
                hour++;
                minute = 0;
            }
        }
        return slots;
    };

   
    const saveBooking = async () => {
        if (!user?.userName) {
            toast("Sign in as a user to book a service!");
            return;
        }
    
        if (!selectedTime || !date) {
            toast("Date or time not selected!");
            return;
        }
    
        const formattedDate = date.toISOString().split("T")[0];
    
        if (bookedSlots.get(formattedDate)?.includes(selectedTime)) {
            toast("This time slot is already booked.");
            return;
        }
    
        try {
            const formData = {
                name: user.userName, 
                email: user.email,
                date: formattedDate,
                time: selectedTime,
                business: id,
                status: "Booked",
            };
    
            await axios.post("http://localhost:5000/api/bookings", formData, {
                headers: { "Content-Type": "application/json" },
            });

            toast("Booked Successfully!");
    
            setBookedSlots((prev) => {
                const newMap = new Map(prev);
                if (!newMap.has(formattedDate)) newMap.set(formattedDate, []);
                newMap.get(formattedDate).push(selectedTime);
                return newMap;
            });
    
            setSelectedTime(null);
        } catch (error) {
            toast("Error booking appointment:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <Sheet className="z-[9999]" >
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent  className="z-[9999]" >
                    <SheetHeader>
                        <SheetTitle className="text-lg text-left">Book Service</SheetTitle>
                        <SheetDescription>Pick a date and time to book your appointment.</SheetDescription>
                    </SheetHeader>

                    {/* ✅ Select Date */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-sm font-medium">Select a Date</h2>
                        <div className="max-w-[280px] border border-gray-300 rounded-md scale-[0.9]">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => setDate(newDate)}
                                className="rounded-md w-full"
                            />
                        </div>
                    </div>

                    {/* ✅ Select Time Slot */}
                    <TooltipProvider>
                        <div>
                            <h2 className="text-sm font-medium mt-1">Select a Time Slot</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {generateTimeSlots().map((time) => {
                                    const formattedDate = date?.toISOString().split("T")[0] || "";
                                    const bookedTimes = bookedSlots.get(formattedDate) || [];
                                    const isBooked = bookedTimes.includes(time);

                                    return (
                                        <Tooltip key={time}>
                                            <TooltipTrigger asChild>
                                                <motion.button
                                                    onClick={() => !isBooked && setSelectedTime(time)}
                                                    className={`px-2 py-2 text-xs font-medium rounded-full transition-all shadow-sm
                                                    ${isBooked
                                                        ? "bg-red-500 text-white cursor-not-allowed" 
                                                        : selectedTime === time
                                                            ? "bg-primary text-white"
                                                            : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={isBooked}
                                                >
                                                    {time}
                                                </motion.button>
                                            </TooltipTrigger>
                                            {isBooked && (
                                                <TooltipContent side="top">
                                                    <span>Already Booked</span>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    </TooltipProvider>

                    {/* ✅ Confirm Booking */}
                    <SheetFooter className="flex justify-end mt-1">
                        <SheetClose asChild>
                            <div className="flex gap-5">
                                <Button
                                    className="bg-primary text-white px-4"
                                    disabled={!(selectedTime && date)}
                                    onClick={saveBooking}
                                >
                                    Book
                                </Button>
                            </div>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default BookingSec;
