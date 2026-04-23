import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { LogOut, User, LogIn, KeyRound, ChevronDown, Menu } from "lucide-react";
import Wordmark from "./ui/Wordmark";

const DashNav = ({ onMenuClick }) => {
    const { logout, loginDetails } = useContext(AuthContext);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const popupRef = useRef(null);
    const buttonRef = useRef(null);

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

    const initials = (loginDetails?.name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-ink-100 h-16">
            <div className="h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    {onMenuClick ? (
                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label="Open menu"
                            className="lg:hidden -ml-1 p-2 rounded-md text-slate-600 hover:bg-cream-200 hover:text-ink-900 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    ) : null}
                    <Link
                        to={logoLink}
                        className="text-ink-900 hover:text-brass-500 transition-colors truncate"
                    >
                        <Wordmark size="md" />
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {loginDetails ? (
                        <div className="relative">
                            <button
                                ref={buttonRef}
                                onClick={() => setOpen((p) => !p)}
                                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-cream-200 transition-colors"
                            >
                                <div className="w-8 h-8 bg-ink-900 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold">
                                    {initials || <User className="w-4 h-4" />}
                                </div>
                                <div className="hidden sm:flex flex-col leading-tight items-start">
                                    <span className="text-sm font-semibold text-ink-900 max-w-[140px] truncate">
                                        {loginDetails.name}
                                    </span>
                                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate-500">
                                        {loginDetails.role}
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                                />
                            </button>
                            {open && (
                                <div
                                    ref={popupRef}
                                    className="absolute right-0 top-[calc(100%+6px)] bg-white border border-ink-100 shadow-pop rounded-xl z-[9999] flex flex-col py-1.5 min-w-[220px] overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-ink-100">
                                        <div className="text-sm font-semibold text-ink-900 truncate">
                                            {loginDetails.name}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate">
                                            {loginDetails.email}
                                        </div>
                                    </div>
                                    <Link
                                        to="/account_page"
                                        className="flex items-center gap-3 px-4 py-2.5 text-ink-900 hover:bg-cream-200 transition-colors text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        <User className="w-4 h-4 text-slate-500" />
                                        <span>Profile</span>
                                    </Link>
                                    <Link
                                        to="/account_reset_pass"
                                        className="flex items-center gap-3 px-4 py-2.5 text-ink-900 hover:bg-cream-200 transition-colors text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        <KeyRound className="w-4 h-4 text-slate-500" />
                                        <span>Change Password</span>
                                    </Link>
                                    <div className="lw-rule my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2.5 text-error-600 hover:bg-error-50 transition-colors w-full text-left text-sm"
                                        aria-label="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brass-400 hover:bg-brass-500 text-white rounded-md font-medium text-sm transition-colors shadow-xs"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Sign in</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DashNav;
