import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import Layout from "../layout";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import CategoryPage from "../pages/CategoryPage";
import BusinessDetails from "../pages/BusinessDetails";
import ProtectedRoute from "./ProtectedRoute";
import Profile from '../pages/Profile';
import About from "@/pages/About";

const AppRoutes = () => {
    const dispatch = useDispatch();

    
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser && storedUser !== "undefined") {
                dispatch(loginSuccess(JSON.parse(storedUser)));
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user");
        }
    }, [dispatch]);
    

    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/about" element={<About />} />
                    
                    {/* Protect /details/:id */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/details/:id" element={<BusinessDetails />} />
                        <Route path="/profile/:id" element={<Profile />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
