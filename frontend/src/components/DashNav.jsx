import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LayoutDashboard, LogOut, User, LogIn, KeyRound } from "lucide-react";

const DashNav = () => {
    const { logout, loginDetails } = useContext(AuthContext);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    const handleOpen = () => {
        setOpen((prev) => !prev);
        // console.log(open);
    };

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                open &&
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Determine where to navigate when clicking logo/text
    const logoLink = loginDetails ? "/dashboard" : "/";

    return (
        <nav className="flex flex-row items-center justify-between w-full bg-gradient-to-b from-gray-100 to-gray-50 shadow-md sticky top-0 z-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo Section (Left Corner) */}
                    <Link to={logoLink}>
                <div className="flex items-center space-x-3 h-full">
                    <img src="/newNew.png" alt="SafeLocker Logo" className="h-[3rem] w-[3rem] transition-transform duration-300 hover:scale-110" />
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">LockerWise</span>
                </div>
                    </Link>

                {/* Navigation Links and User Profile Section (Right Corner) */}
                <div className="flex items-center space-x-6 ml-auto">
                    

                    {/* User Profile Picture Link or Login Button */}
                    {loginDetails ? (
                    <div className="relative cursor-pointer z-50">
                        {loginDetails.role === "Admin" ? (
                            <>
                                <div ref={buttonRef} onClick={handleOpen} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 leading-tight">{loginDetails.name}</span>
                                        <span className="text-xs text-gray-600 leading-tight">{loginDetails.role}</span>
                                    </div>
                                </div>
                                {open && (
                                    <div ref={popupRef} className="absolute right-0 top-[4rem] w-auto bg-gray-400/50 backdrop-blur-sm rounded-2xl shadow-lg z-[9999] flex flex-col p-2 space-y-1 min-w-[180px]">
                                        <Link 
                                            to="/account_page" 
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                                            onClick={() => setOpen(false)}
                                        >
                                            <User className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">Profile</span>
                                        </Link>
                                        <Link 
                                            to="/account_reset_pass" 
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                                            onClick={() => setOpen(false)}
                                        >
                                            <KeyRound className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">Change Password</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold w-full text-left"
                                            aria-label="Logout"
                                        >
                                            <LogOut className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div ref={buttonRef} onClick={handleOpen} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 leading-tight">{loginDetails.name}</span>
                                        <span className="text-xs text-gray-600 leading-tight">{loginDetails.role}</span>
                                    </div>
                                </div>
                                {open && (
                                    <div ref={popupRef} className="absolute right-0 top-[4rem] w-auto bg-gray-400/50 backdrop-blur-sm rounded-2xl shadow-lg z-[9999] flex flex-col p-2 space-y-1 min-w-[180px]">
                                        <Link 
                                            to="/account_page" 
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                                            onClick={() => setOpen(false)}
                                        >
                                            <User className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">Profile</span>
                                        </Link>
                                        <Link 
                                            to="/account_reset_pass" 
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                                            onClick={() => setOpen(false)}
                                        >
                                            <KeyRound className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">Change Password</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-bold w-full text-left"
                                            aria-label="Logout"
                                        >
                                            <LogOut className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    ) : (
                        // Show Login Button when user is not logged in
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-semibold shadow-lg"
                        >
                            <LogIn className="w-5 h-5" />
                            <span>Login</span>
                        </Link>
                    )}

                    {/* Logout Button */}
                
                </div>
            </div>
        </nav>
    );
};

export default DashNav;
