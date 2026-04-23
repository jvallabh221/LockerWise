import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LogOut, User, LogIn, KeyRound } from "lucide-react";
import Wordmark from "./ui/Wordmark";

const DashNav = () => {
    const { logout, loginDetails } = useContext(AuthContext);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

    const handleOpen = () => setOpen((prev) => !prev);

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
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const logoLink = loginDetails ? "/dashboard" : "/";

    return (
        <nav className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur border-b border-ink-900/10">
            <div className="w-full px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between">
                <Link to={logoLink} className="text-ink-900 hover:text-brass-400 transition-colors">
                    <Wordmark size="md" />
                </Link>

                <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                    {loginDetails ? (
                        <div className="relative cursor-pointer z-50">
                            <div
                                ref={buttonRef}
                                onClick={handleOpen}
                                className="flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-ink-900/5 transition-colors cursor-pointer"
                            >
                                <div className="w-9 h-9 bg-ink-900 rounded-sm flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-cream-50" />
                                </div>
                                <div className="hidden sm:flex flex-col leading-tight">
                                    <span className="text-sm font-semibold text-ink-900">{loginDetails.name}</span>
                                    <span className="font-mono text-[0.65rem] uppercase tracking-editorial text-slate-500">
                                        {loginDetails.role}
                                    </span>
                                </div>
                            </div>
                            {open && (
                                <div
                                    ref={popupRef}
                                    className="absolute right-0 top-[3.5rem] bg-white border border-ink-900/10 shadow-paper rounded-sm z-[9999] flex flex-col py-1 min-w-[200px]"
                                >
                                    <Link
                                        to="/account_page"
                                        className="flex items-center gap-3 px-4 py-2.5 text-ink-900 hover:bg-cream-100 transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">Profile</span>
                                    </Link>
                                    <Link
                                        to="/account_reset_pass"
                                        className="flex items-center gap-3 px-4 py-2.5 text-ink-900 hover:bg-cream-100 transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        <KeyRound className="w-4 h-4" />
                                        <span className="text-sm">Change Password</span>
                                    </Link>
                                    <div className="lw-rule my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2.5 text-ink-900 hover:bg-cream-100 transition-colors w-full text-left"
                                        aria-label="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 hover:bg-ink-700 text-cream-50 border border-ink-900 font-mono text-xs uppercase tracking-editorial transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DashNav;
