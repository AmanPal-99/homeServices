import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../utils/userSchema.js";
import Business from "../utils/bSchema.js";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();
const router = express.Router();

// Configure multer to handle FormData (without files)
const upload = multer().none();

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Send Token Response
const sendTokenResponse = (res, token, user, role) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.status(200).json({
        message: role === "business" ? "Business login successful!" : "User login successful!",
        user,
        role,
    });
};

// Login or Signup Route
router.post("/", upload, async (req, res) => {
    try {
       
        
        const {
            email,
            password,
            address,
            userName, 
            name, 
            contact,
            category
        } = req.body;
      
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        let business = await Business.findOne({ email });

        // If the user already exists, log them in
        if (user || business) {
            let foundUser = user || business; 
            const isBusiness = !!business;
            const isMatch = await bcrypt.compare(password, foundUser.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials, please try again" });
            }

            const token = generateToken(foundUser._id, isBusiness ? "business" : "user");

            return sendTokenResponse(res, token, {
                _id: foundUser._id,
                email: foundUser.email,
                address: foundUser.address,
                userName: isBusiness ? null : foundUser.userName, 
                ...(isBusiness && {
                    name: foundUser.name,
                    contact: foundUser.contact,
                    about: foundUser.about,
                    category: foundUser.category,
                    imageUrl: foundUser.imageUrl,
                }),
            }, isBusiness ? "business" : "user");
        }

        // Determine if it's a business signup
        const isBusiness = name && contact;
        if (isBusiness && (!name || !contact || !category)) {
            return res.status(400).json({ message: "All business fields are required" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;
        let role = "user";

        if (isBusiness) {
            role = "business";
            newUser = new Business({
                name,
                email,
                password: hashedPassword,
                address,
                contact,
                about: "No description provided",
                category,
                imageUrl: "", 
            });
        } else {
            newUser = new User({
                userName, 
                email,
                password: hashedPassword,
                address,
            });
        }

        await newUser.save();
        const token = generateToken(newUser._id, role);

        return sendTokenResponse(res, token, {
            _id: newUser._id,
            email: newUser.email,
            address: newUser.address,
            userName: role === "business" ? null : newUser.userName,
            ...(role === "business" && {
                name: newUser.name,
                contact: newUser.contact,
                about: newUser.about,
                category: newUser.category,
                imageUrl: newUser.imageUrl,
            }),
        }, role);
        
    } catch (err) {
        console.error("Error in auth route:", err);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
});

export default router;
