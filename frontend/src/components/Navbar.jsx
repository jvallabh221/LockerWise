import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LayoutDashboard, LogOut } from "lucide-react";
import Wordmark from "./ui/Wordmark";

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="w-full bg-ink-900 text-cream-50 border-b border-ink-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center justify-between h-full">
                    <Link to="/" className="text-cream-50 hover:text-brass-300 transition-colors">
                        <Wordmark size="md" />
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 px-3 py-2 border border-cream-50/30 hover:border-brass-300 hover:text-brass-300 transition-colors font-mono text-xs uppercase tracking-editorial"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-brass-400 hover:bg-brass-500 text-ink-900 font-mono text-xs uppercase tracking-editorial transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>

                        <Link to="/account_page" className="relative">
                            <img
                                src={user?.photoURL || "/user-1.png"}
                                alt="User Profile"
                                className="w-9 h-9 rounded-sm border border-cream-50/40 hover:border-brass-300 transition-colors object-cover"
                            />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="sm:hidden inline-flex items-center gap-2 px-3 py-2 bg-brass-400 text-ink-900 transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
