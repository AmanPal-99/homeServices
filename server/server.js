import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/business.js';
import bookingRoutes from './routes/bookings.js';
import profileRoutes from './routes/profile.js';
import mapRoutes from "./routes/mapRoutes.js";


dotenv.config();

const app = express();
const port  = process.env.PORT || 5000;

app.use(express.json({ limit: "60mb" }));  
app.use(express.urlencoded({ limit: "60mb", extended: true }))
app.use(cors());

connectDB();

app.use('/auth',authRoutes);

app.use('/api/businesses', businessRoutes);

app.use('/api/bookings',bookingRoutes);

app.use('/api/profile',profileRoutes);


app.use("/api/map", mapRoutes);

app.listen(port,()=>console.log(`server running on port ${port} `));