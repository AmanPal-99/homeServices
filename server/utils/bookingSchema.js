import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: {type: String , required:true,},
  date: { type: Date, required: true },
  time: { type: String, required: true },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "business",
    required: true,
  },
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "Completed"],
    default: "Booked",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", bookingSchema);
