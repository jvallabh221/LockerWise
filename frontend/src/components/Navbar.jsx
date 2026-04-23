import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LayoutDashboard, LogOut } from "lucide-react";
import Wordmark from "./ui/Wordmark";

/**
 * Legacy top navbar. Kept for any routes that still import it.
 * Prefer DashNav.jsx for app pages going forward.
 */
const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="w-full bg-ink-900 text-white border-b border-ink-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center justify-between h-full">
                    <Link to="/" className="text-white hover:text-brass-300 transition-colors">
                        <Wordmark size="md" />
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 hover:border-brass-300 hover:text-brass-300 text-sm font-medium transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brass-400 hover:bg-brass-500 text-white text-sm font-medium transition-colors shadow-xs"
                            aria-label="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Log out</span>
                        </button>

                        <Link to="/account_page" className="relative">
                            <img
                                src={user?.photoURL || "/user-1.png"}
                                alt="Profile"
                                className="w-9 h-9 rounded-full border border-white/30 hover:border-brass-300 transition-colors object-cover"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
