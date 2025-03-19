import express from "express";
import User from "../utils/userSchema.js";
import Business from "../utils/bSchema.js";
import Booking from "../utils/bookingSchema.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinaryConfig.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "home-services",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});
const upload = multer({ storage });


// ✅ GET PROFILE & BOOKINGS
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id.trim();
        let profileData;
        let bookings = [];

        const user = await User.findById(userId).select("-password");
        if (user) {
            profileData = user;
            bookings = await Booking.find({ email: user.email }).populate({
                path: "business",
                select: "name",
                strictPopulate: false,
            });
        } else {
            const business = await Business.findById(userId).select("-password");
            if (!business) return res.status(404).json({ message: "Profile not found" });

            profileData = business;
            bookings = await Booking.find({ business: business._id }).populate({
                path: "business",
                select: "name",
                strictPopulate: false,
            });
        }

        res.json({ profile: profileData, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// ✅ UPDATE PROFILE (With Password Check)
router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, email, address, contact, about, category, imageUrl, userName, name } = req.body;

        let updateFields = {};
        if (email) updateFields.email = email;
        if (address) updateFields.address = address;

        let updatedProfile;
        let user = await User.findById(userId);
        let isBusiness = false;

        if (user) {
            if (userName) updateFields.userName = userName;
        } else {
            user = await Business.findById(userId);
            isBusiness = true;
            if (!user) return res.status(404).json({ message: "Profile not found" });

            if (name) updateFields.name = name;
            if (contact) updateFields.contact = contact;
            if (about) updateFields.about = about;
            if (category) updateFields.category = category;
            if (imageUrl) updateFields.imageUrl = imageUrl;
        }

        if (newPassword) {
            if (!oldPassword) return res.status(400).json({ message: "Old password is required" });

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(newPassword, salt);
        }

        updatedProfile = isBusiness
            ? await Business.findByIdAndUpdate(userId, { $set: updateFields }, { new: true, runValidators: true })
            : await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true, runValidators: true });

        res.json({ message: "Profile updated successfully", updatedProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



router.delete("/booking/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        await Booking.findByIdAndDelete(bookingId);
        res.json({ message: "Booking canceled" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



router.put("/booking/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = "Completed";
        await booking.save();

        res.json({ message: "Booking marked as completed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



router.post("/:id/upload-profile-image", upload.single("imageUrl"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const imageUrl = req.file.path; // Cloudinary URL

        let updatedProfile = await Business.findByIdAndUpdate(
            id,
            { imageUrl },
            { new: true }
        );

        if (!updatedProfile) return res.status(404).json({ message: "User or Business not found" });

        return res.status(200).json({ imageUrl: updatedProfile.imageUrl });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
});


router.delete("/:id/remove-profile-image", async (req, res) => {
    try {
        const { id } = req.params;

        const business = await Business.findById(id);
        if (!business || !business.imageUrl) return res.status(404).json({ message: "Image not found" });

        const publicId = business.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);

        business.imageUrl = "";
        await business.save();

        res.status(200).json({ message: "Profile image removed successfully" });
    } catch (error) {
        console.error("Error removing profile image:", error);
        res.status(500).json({ message: "Server error" });
    }
});



router.post("/:id/upload-gallery-image", upload.single("gallery"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });

        const imageUrl = req.file.path; // Cloudinary URL

        let updatedProfile = await Business.findByIdAndUpdate(
            id,
            { $push: { gallery: imageUrl } },
            { new: true }
        );

        if (!updatedProfile) return res.status(404).json({ message: "Business not found" });

        return res.status(200).json({ gallery: updatedProfile.gallery });
    } catch (error) {
        console.error("Error uploading gallery image:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
});


router.delete("/:id/remove-image", async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        const business = await Business.findById(id);
        if (!business) return res.status(404).json({ message: "Business not found" });

        const publicId = imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);

        business.gallery = business.gallery.filter(img => img !== imageUrl);
        await business.save();

        res.json({ message: "Image removed", updatedImages: business.gallery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
