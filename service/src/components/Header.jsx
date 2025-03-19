import { Image } from "@unpic/react";
import React from "react";
import { Button } from "./ui/Button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";



function Header() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = user !== null;
  const navigate = useNavigate();
 

  const handleClick = () => {
    if (isAuthenticated) {
        console.log(user);
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="px-5 py-2 shadow-md rounded-md flex justify-between items-center bg-[#eddcfe] ">
      
      <div className="flex items-center gap-8">
        <Link to="/">
          <Image src="/logoipsum-361.svg" alt="logo" width={50} height={50} />
        </Link>
        <div className="md:flex items-center gap-6 hidden">
          <Link to="/" className="hover:scale-105 hover:text-primary cursor-pointer">Home</Link>
          <Link to="/category/Cleaning" className="hover:scale-105 hover:text-primary cursor-pointer">Services</Link>
          <Link to="/about" className="hover:scale-105 hover:text-primary cursor-pointer">About Us</Link>
        </div>
      </div>
      
      

      <div className="py-2">
        <Button onClick={handleClick}>
          {isAuthenticated ? "Profile" : "Get Started"}
        </Button>
      </div>
    </div>
  );
}

export default Header;
