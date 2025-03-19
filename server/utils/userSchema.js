import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    userName:{type:String , required:true, unique:true},
    password: {type: String , required:true},
    email: { type: String, required: true, unique: true, lowercase: true },
    address: {type:String , required:true},
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("user", userSchema);

export default User;

