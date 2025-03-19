import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    about: { type: String, required: true },
    category: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    imageUrl: { type: String, default:"", }, 
    gallery: [String],
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

function arrayLimit(val) {
    return val.length <= 5;
}


businessSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Business = mongoose.model("business", businessSchema);
export default Business;
