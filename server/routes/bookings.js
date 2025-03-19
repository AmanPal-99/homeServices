import express from "express";
import Booking from "../utils/bookingSchema.js";

const router = express.Router();

router.get("/booked-slots/:businessId", async (req, res) => {
    try {
        const { businessId } = req.params;
        const bookings = await Booking.find({ business: businessId });

       
        const bookedSlots = {};
        bookings.forEach(({ date, time, _id }) => {
            if (!bookedSlots[date]) {
                bookedSlots[date] = [];
            }
            bookedSlots[date].push({ time, _id });
        });

        res.json(bookedSlots);
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/", async (req, res) => {
    try {
        const { name, email, date, time, business, status } = req.body;

        if (!name || !email || !date || !time || !business) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingBooking = await Booking.findOne({ business, date, time });
        if (existingBooking) {
            return res.status(400).json({ message: "This time slot is already booked" });
        }

        const newBooking = new Booking({ name, email, date, time, business, status });
        await newBooking.save();

        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
