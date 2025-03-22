import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { toast } from "sonner"
import { Image } from "@unpic/react";

export default function Profile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [galleryImages, setGalleryImages] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
    };

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`https://homeservices-production.up.railway.app/api/profile/${id}`);
            setProfile(res.data.profile);
            setFormData(res.data.profile);
            setGalleryImages(res.data.profile?.gallery || []);

            const populatedBookings = res.data.bookings.map(booking => ({
                ...booking,
                businessName: booking.business?.name || "Unknown Business",
            }));

            setBookings(populatedBookings);
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    const handleUpdate = async () => {
        try {
            const updateData = { ...formData };

            if (newPassword) {
                if (!oldPassword) {
                    toast.error("Please enter your old password to update the password.");
                    return;
                }
                updateData.oldPassword = oldPassword;
                updateData.newPassword = newPassword;
            }

            const response = await axios.put(`https://homeservices-production.up.railway.app/api/profile/${id}`, updateData);

            if (response.status === 200) {
                setProfile(response.data.updatedProfile);
                setFormData(response.data.updatedProfile);
                setEditing(false);
                setOldPassword("");
                setNewPassword("");
                fetchProfile();
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Profile update failed.");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile. Make sure the old password is correct.");
        }
    };

    const cancelBooking = async (bookingId) => {
        try {
            await axios.delete(`https://homeservices-production.up.railway.app/api/profile/booking/${bookingId}`);
            fetchProfile();
            toast.success("Booking canceled.");
        } catch (err) {
            console.error("Error canceling booking:", err);
            toast.error("Failed to cancel booking.");
        }
    };

    const completeBooking = async (bookingId) => {
        try {
            await axios.put(`https://homeservices-production.up.railway.app/api/profile/booking/${bookingId}`);
            fetchProfile();
            toast.success("Booking marked as completed.");
        } catch (err) {
            console.error("Error completing booking:", err);
            toast.error("Failed to mark booking as completed.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size must be less than 10 MB.");
            return;
        }

        const formData = new FormData();
        formData.append("gallery", file);

        try {
            const res = await axios.post(
                `https://homeservices-production.up.railway.app/api/profile/${id}/upload-gallery-image`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                setGalleryImages(res.data.gallery);
                fetchProfile();
                toast.success("Image uploaded successfully!");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        }
    };

    const removeImage = async (imageUrl) => {
        try {
            await axios.delete(`https://homeservices-production.up.railway.app/api/profile/${id}/remove-image`, {
                data: { imageUrl },
            });

            setGalleryImages(galleryImages.filter(img => img !== imageUrl));
            fetchProfile();
            toast.success("Image removed.");
        } catch (error) {
            console.error("Error removing image:", error);
            toast.error("Failed to remove image.");
        }
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size must be less than 10 MB.");
            return;
        }

        const formData = new FormData();
        formData.append("imageUrl", file);

        try {
            const res = await axios.post(
                `https://homeservices-production.up.railway.app/api/profile/${id}/upload-profile-image`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                setFormData((prevData) => ({
                    ...prevData,
                    imageUrl: res.data.imageUrl,
                }));
                fetchProfile();
                toast.success("Profile image updated!");
            }
        } catch (error) {
            console.error("Error uploading profile image:", error);
            toast.error("Failed to upload profile image.");
        }
    };

    const handleRemoveProfileImage = async () => {
        try {
            const res = await axios.delete(`https://homeservices-production.up.railway.app/api/profile/${id}/remove-profile-image`);

            if (res.status === 200) {
                setFormData((prevData) => ({
                    ...prevData,
                    imageUrl: "",
                }));
                fetchProfile();
                toast.success("Profile image removed.");
            }
        } catch (error) {
            console.error("Error removing profile image:", error);
            toast.error("Failed to remove profile image.");
        }
    };

    return (
        <div className="min-h-screen p-6  flex flex-col">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center "
                >
                    <h1 className="text-4xl font-extrabold text-primary">My Profile</h1>
                </motion.div>
                {profile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 px-48 gap-6"
                    >

                        {/* Profile Card */}
                        <div className="bg-white shadow-xl rounded-2xl border-2 border-primary py-4 px-6 flex flex-col 
                                bg-gradient-to-br from-purple-200 via-purple-100 to-purple-50
                                h-[550px] overflow-hidden overflow-y-auto scrollbar-hide"
                        >

                            {editing ? (

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col space-y-4"
                                >
                                    <h2 className="text-3xl font-bold text-center mb-4 text-primary">Edit Profile</h2>
                                    <div className="flex flex-col items-center space-y-3">
                                        {profile.imageUrl ? (
                                            <Image
                                                src={profile.imageUrl}
                                                width={150}
                                                height={150}
                                                alt="Business"
                                                className=" rounded-full border-4 border-primary object-cover"
                                            />
                                        ) : (
                                            <img
                                                src="/userlogo.png"
                                                alt="User"
                                                className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            id="profileImageInput"
                                            className="hidden"
                                            onChange={handleProfileImageUpload}
                                        />
                                        <div className="flex gap-2" >
                                            <label
                                                htmlFor="profileImageInput"
                                                className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md transition hover:bg-primary-dark"
                                            >
                                                New Image
                                            </label>

                                            {formData.imageUrl && (
                                                <Button
                                                    onClick={handleRemoveProfileImage}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Remove Image
                                                </Button>
                                            )}
                                        </div>

                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name !== undefined ? formData.name : formData.userName || ""}
                                        onChange={(e) => {
                                            if (formData.name !== undefined) {

                                                setFormData({ ...formData, name: e.target.value });
                                            } else {

                                                setFormData({ ...formData, userName: e.target.value });
                                            }
                                        }}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-semibold text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address || ""}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    {formData.contact !== undefined && (
                                        <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-semibold text-gray-700">Contact</label>
                                            <input
                                                type="text"
                                                value={formData.contact || ""}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    )}
                                    {formData.about !== undefined && (
                                        <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-semibold text-gray-700">About</label>
                                            <textarea
                                                value={formData.about || ""}
                                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    )}
                                    {/* Password update */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-semibold text-gray-700">Old Password</label>
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-semibold text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex space-x-4 mt-6 justify-center">
                                        <Button
                                            onClick={handleUpdate}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData(profile);
                                                setOldPassword("");
                                                setNewPassword("");
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        {profile.imageUrl ? (
                                            <Image
                                                src={profile.imageUrl}
                                                width={150}
                                                height={150}
                                                alt="Business"
                                                className=" rounded-full border-4 border-primary object-cover"
                                            />
                                        ) : (
                                            <img
                                                src="/userlogo.png"
                                                alt="User"
                                                className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="px-4 rounded-lg flex-1">
                                        <div className=" flex flex-col gap-4 text-lg ">
                                            <p>
                                                <strong className="text-primary">Name:</strong> {profile.userName || profile.name}
                                            </p>
                                            <p>
                                                <strong className="text-primary">Email:</strong> {profile.email}
                                            </p>
                                            <p >
                                                <strong className="text-primary">Address:</strong> {profile.address}
                                            </p>
                                            {profile.contact && (
                                                <p>
                                                    <strong className="text-primary">Contact:</strong>{profile.contact}
                                                </p>
                                            )}
                                            {profile.about && (
                                                <div className="grid grid-cols-1 gap-2">
                                                    <p className="text-primary font-semibold">About:</p>
                                                    <div className="text-gray-800 text-[1rem] max-h-24 scrollbar-hide overflow-y-auto p-2 border border-gray-300 rounded-md">
                                                        {profile.about}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4 space-x-4">
                                        <Button
                                            onClick={() => setEditing(true)}
                                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>


                        {/* Bookings Card */}
                        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col bg-gradient-to-r border-2 border-primary
                            from-purple-200 via-purple-100 to-purple-50 h-[550px] overflow-y-auto"
                        >

                            <h2 className="text-2xl font-bold text-primary mb-4">
                                {profile.role === "business" ? "Manage Bookings" : "My Bookings"}
                            </h2>
                            <div className="space-y-4 flex-1 overflow-y-auto">
                                {bookings.length > 0 ? (
                                    bookings.map((b) => (
                                        <motion.div
                                            key={b._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center"
                                        >
                                            <div className="mb-4 md:mb-0">
                                                <p className="text-lg font-semibold">
                                                    {new Date(b.date).toLocaleDateString()} at {b.time}
                                                </p>
                                                <p className="text-md font-medium text-primary">
                                                    {b.businessName}
                                                </p>
                                                <p className={`font-semibold ${b.status === "Cancelled" ? "text-red-500" : b.status === "Completed" ? "text-green-500" : "text-yellow-500"}`}>
                                                    {b.status}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                {profile.role === "business" ? (
                                                    <>
                                                        <Button
                                                            onClick={() => completeBooking(b._id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                                                        >
                                                            Complete
                                                        </Button>
                                                        <Button
                                                            onClick={() => cancelBooking(b._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        onClick={() => cancelBooking(b._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No bookings available.</p>
                                )}

                            </div>
                        </div>


                        {profile.contact && (
                            < motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white shadow-xl rounded-2xl border-2 border-primary p-6 flex flex-col items-center w-full
                                bg-gradient-to-r from-purple-200 via-purple-100 to-purple-50  col-span-2 "
                            >
                                <h2 className="text-3xl font-bold text-primary mb-4">Business Gallery</h2>
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="fileInput"
                                        disabled={galleryImages.length >= 5}
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className={`cursor-pointer bg-primary text-white px-4 py-2 rounded-md transition 
                                            ${galleryImages.length >= 5 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"}`}
                                    >
                                        Upload Image
                                    </label>
                                    {galleryImages.length >= 5 && (
                                        <p className="text-red-500 text-sm mt-1">Max 5 images allowed</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-6 w-full">
                                    {galleryImages.map((img, index) => (
                                        <div key={index} className="relative group w-full">
                                            <img
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                className="w-full h-30 rounded-lg object-cover shadow-md"
                                            />
                                            <Button
                                                onClick={() => removeImage(img)}
                                                className="absolute top-2 right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition"
                                            >
                                                X
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                        )}

                    </motion.div>
                ) : (
                    <p className="text-center text-gray-500">Loading...</p>
                )}
            </div>
        </div >
    );
}
