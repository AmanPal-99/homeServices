import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { Image } from "@unpic/react";

export default function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [isFlipped, setIsFlipped] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        address: "",
        contact: "",
        name: "",
        category: "",
    });

    const categories = ["Cleaning", "Repair", "Painting", "Shifting", "Plumbing", "Electric"];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSignup = async () => {
        const dataToSend = new FormData();
        dataToSend.append("email", formData.email);
        dataToSend.append("password", formData.password);
        dataToSend.append("address", formData.address);


        if (isBusiness) {
            dataToSend.append("name", formData.name);
            dataToSend.append("contact", formData.contact);
            dataToSend.append("category", selectedCategory);
        } else {
            dataToSend.append("userName", formData.userName);
        }
        try {
            const response = await fetch("http://localhost:5000/auth", {
                method: "POST",
                body: dataToSend
            });

            const result = await response.json();
            if (response.ok) {
                dispatch(loginSuccess(result.user));
                if (formData.address.trim() !== "") {
                    toast("Signup Successful! Complete your profile in the profile section.");
                } else {
                    toast("Login Successful!");
                }
                navigate("/");
            } else {
                toast(result.error || " Login/Signup failed");
            }
        } catch (error) {
            console.error(error);
            toast("An error occurred");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className={`relative transition-all duration-1000 ${isBusiness ? "w-[550px]" : "w-[350px]"} h-[500px]`}>
                <div
                    className={`relative w-full h-full transition-transform duration-500 transform ${isFlipped ? "rotate-y-180" : ""}`}
                    style={{ transformStyle: "preserve-3d" }}
                >


                    <div className="absolute w-full h-full bg-white shadow-xl rounded-xl flex flex-col items-center justify-center backface-hidden p-6">
                        <div className="mb-10">
                            <Image
                                src="/logoipsum-361.svg"
                                height={100}
                                width={100}
                                alt="logo"
                            />
                        </div>
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Login</h2>
                        <input type="email" placeholder="Email" name="email" onChange={handleChange} value={formData.email} className="w-full px-4 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="password" placeholder="Password" name='password' onChange={handleChange} value={formData.password} className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
                        <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600" onClick={handleSignup}>Log In</button>
                        <p className="mt-3 text-sm">
                            Don't have an account?{" "}
                            <button onClick={() => setIsFlipped(true)} className="text-blue-500 underline">
                                Sign up
                            </button>
                        </p>
                    </div>

                    <div className="absolute w-full h-full bg-white shadow-xl rounded-xl flex flex-col items-center justify-center backface-hidden rotate-y-180 p-6">
                        
                    
                        <div className="mb-3">
                            <Image
                                src="/logoipsum-361.svg"
                                height={100}
                                width={100}
                                alt="logo"
                            />
                        </div>


                        <h2 className="text-3xl font-semibold text-gray-700 mb-3">Sign Up</h2>
                        <div className={`grid w-full transition-all duration-500 ${isBusiness ? "grid-cols-2 gap-4" : "grid-cols-1"}`}>
                            <div className="flex flex-col gap-2">
                                {!isBusiness && (
                                    <input type="text" placeholder="Username" name="userName" onChange={handleChange} value={formData.userName} className="px-4 py-2 border rounded-lg" />
                                )}
                                <input type="email" placeholder="Email" name="email" onChange={handleChange} value={formData.email} className="px-4 py-2 border rounded-lg" />
                                <input type="password" placeholder=" Create a password" name="password" onChange={handleChange} value={formData.password} className="px-4 py-2 border rounded-lg" />
                                <input type="text" placeholder="Address" name="address" onChange={handleChange} value={formData.address} className="px-4 py-2 border rounded-lg" />
                                <label className="flex items-center space-x-2 text-gray-600">
                                    <input type="checkbox" checked={isBusiness} onChange={(e) => setIsBusiness(e.target.checked)} className="w-4 h-4" />
                                    <span>Sign up as Business</span>
                                </label>
                            </div>

                            {isBusiness && (
                                <div className="flex flex-col gap-2">
                                    <input type="text" placeholder="Business Name" name="name" onChange={handleChange} value={formData.name} className="px-4 py-2 border rounded-lg" />
                                    <input type="text" placeholder="Contact Number" name="contact" onChange={handleChange} value={formData.contact} className="px-4 py-2 border rounded-lg" />


                                    <label className="block text-gray-600 text-sm">Select Business Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`px-2 py-2 rounded-lg border transition-all ${selectedCategory === category ? "bg-primary text-white" : "bg-gray-200 hover:bg-primary hover:text-white"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button type='submit' className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 mt-4" onClick={handleSignup}>Sign Up</button>
                        <p className="mt-3 text-sm">
                            Already Registered?{" "}
                            <button onClick={() => setIsFlipped(false)} className="text-blue-500 underline">
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
