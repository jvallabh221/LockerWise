import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="w-full  bg-gray-900/90 text-white backdrop-blur-md shadow-md py-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center justify-between h-full">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <img src="/DraconX.png" alt="SafeLocker Logo" className="h-10 sm:h-12 transition-transform duration-300 cursor-pointer hover:scale-105" />
                        <span className="text-xl sm:text-2xl xs:hidden font-bold">DraconX</span>
                    </div>

                    {/* Navigation Links and User Profile Section */}
                    <div className="flex items-center space-x-6">
                        {/* Dashboard Link */}
                        <Link to="/dashboard" className="group flex items-center space-x-2 bg-white text-black  hover:scale-105 transition-all ease-in-out px-3 py-2 rounded-md ">
                            <LayoutDashboard className="w-5 h-5 font-bold " />
                            <span className="hidden md:inline  text-sm font-semibold">Dashboard</span>
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md hover:scale-105 transition-all ease-in-out"
                            aria-label="Logout"
                        >
                            <LogOut className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>

                        {/* User Profile Picture Link */}
                        <Link to="/account_page" className="relative group">
                            <img
                                src={user?.photoURL || "/user-1.png"}
                                alt="User Profile"
                                className="w-8 sm:w-10 h-8 sm:h-10 rounded-full cursor-pointer ring-2 ring-white group-hover:ring-white transition-all ease-in-out hover:scale-105"
                            />
                        </Link>

                        {/* Responsive Logout for Smaller Screens */}
                        <button
                            onClick={handleLogout}
                            className="sm:hidden flex items-center space-x-2 bg-gray-700 text-gray-200 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 group"
                            aria-label="Logout"
                        >
                            <LogOut className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
