import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeProvider";
import { useShellMeta } from "../context/ShellMetaContext";
import { getBreadcrumbs } from "../nav/breadcrumbs";
import {
    LogOut,
    User,
    LogIn,
    KeyRound,
    ChevronDown,
    Menu,
    Sun,
    Moon,
    Laptop,
    Search,
    ChevronRight,
} from "lucide-react";
import Wordmark from "./ui/Wordmark";

const themeBtnBase =
    "flex-1 flex items-center justify-center gap-1.5 rounded-sm py-2 text-xs font-medium transition-colors duration-1 ease-lw focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/40";

const DashNav = ({ onMenuClick, variant = "public" }) => {
    const { logout, loginDetails } = useContext(AuthContext);
    const { preference, setPreference } = useTheme();
    const { primaryAction } = useShellMeta();
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const popupRef = useRef(null);
    const buttonRef = useRef(null);
    const searchRef = useRef(null);

    const crumbs = variant === "app" ? getBreadcrumbs(location.pathname) : [];

    useEffect(() => {
        if (variant !== "app") return;
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [variant]);

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

    const themeBtnActive = "bg-[var(--surface)] text-[var(--text)] shadow-sm";
    const themeBtnIdle = "text-[var(--text-3)] hover:text-[var(--text-2)]";

    const profileMenu = loginDetails ? (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors duration-1 ease-lw hover:bg-[var(--bg)]"
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                    {initials || <User className="h-4 w-4" />}
                </div>
                <div className="hidden flex-col items-start leading-tight sm:flex">
                    <span className="max-w-[140px] truncate text-sm font-semibold text-[var(--text)]">
                        {loginDetails.name}
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--text-3)]">
                        {loginDetails.role}
                    </span>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-[var(--text-3)] transition-transform duration-1 ease-lw ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open ? (
                <div
                    ref={popupRef}
                    className="absolute right-0 top-[calc(100%+6px)] z-[9999] flex min-w-[240px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1.5 shadow-pop"
                >
                    <div className="border-b border-[var(--border)] px-4 py-3">
                        <div className="truncate text-sm font-semibold text-[var(--text)]">
                            {loginDetails.name}
                        </div>
                        <div className="truncate text-xs text-[var(--text-3)]">{loginDetails.email}</div>
                    </div>

                    <div className="border-b border-[var(--border)] px-4 py-3">
                        <div className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--text-3)]">
                            Appearance
                        </div>
                        <div
                            className="flex gap-0.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-0.5"
                            role="group"
                            aria-label="Color theme"
                        >
                            <button
                                type="button"
                                onClick={() => setPreference("light")}
                                className={`${themeBtnBase} ${preference === "light" ? themeBtnActive : themeBtnIdle}`}
                                aria-pressed={preference === "light"}
                                aria-label="Use light theme"
                            >
                                <Sun className="h-4 w-4 shrink-0" />
                                <span className="hidden min-[380px]:inline">Light</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreference("dark")}
                                className={`${themeBtnBase} ${preference === "dark" ? themeBtnActive : themeBtnIdle}`}
                                aria-pressed={preference === "dark"}
                                aria-label="Use dark theme"
                            >
                                <Moon className="h-4 w-4 shrink-0" />
                                <span className="hidden min-[380px]:inline">Dark</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreference("system")}
                                className={`${themeBtnBase} ${preference === "system" ? themeBtnActive : themeBtnIdle}`}
                                aria-pressed={preference === "system"}
                                aria-label="Use system theme"
                            >
                                <Laptop className="h-4 w-4 shrink-0" />
                                <span className="hidden min-[380px]:inline">System</span>
                            </button>
                        </div>
                    </div>

                    <Link
                        to="/account_page"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] transition-colors duration-1 ease-lw hover:bg-[var(--bg)]"
                        onClick={() => setOpen(false)}
                    >
                        <User className="h-4 w-4 text-[var(--text-3)]" />
                        <span>Profile</span>
                    </Link>
                    <Link
                        to="/account_reset_pass"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] transition-colors duration-1 ease-lw hover:bg-[var(--bg)]"
                        onClick={() => setOpen(false)}
                    >
                        <KeyRound className="h-4 w-4 text-[var(--text-3)]" />
                        <span>Change Password</span>
                    </Link>
                    <div className="lw-rule my-1" />
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-error-600 transition-colors duration-1 ease-lw hover:bg-[var(--error-bg)]"
                        aria-label="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </div>
            ) : null}
        </div>
    ) : null;

    if (variant === "app" && loginDetails) {
        return (
            <nav className="sticky top-0 z-50 h-[var(--topbar-h)] min-h-[var(--topbar-h)] border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-6 lg:gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-3">
                        {onMenuClick ? (
                            <button
                                type="button"
                                onClick={onMenuClick}
                                aria-label="Open menu"
                                className="-ml-1 rounded-md p-2 text-[var(--text-2)] transition-colors duration-1 ease-lw hover:bg-[var(--bg)] hover:text-[var(--text)] lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        ) : null}
                        <nav aria-label="Breadcrumb" className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto text-[13px] leading-snug">
                            {crumbs.map((c, i) => (
                                <React.Fragment key={`${c.label}-${i}`}>
                                    {i > 0 ? (
                                        <ChevronRight
                                            className="h-3.5 w-3.5 shrink-0 text-[var(--text-3)]"
                                            strokeWidth={1.75}
                                            aria-hidden
                                        />
                                    ) : null}
                                    {c.to ? (
                                        <Link
                                            to={c.to}
                                            className="shrink-0 text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]"
                                        >
                                            {c.label}
                                        </Link>
                                    ) : (
                                        <span className="shrink-0 truncate font-medium text-[var(--text)]">
                                            {c.label}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    </div>

                    <div className="mx-2 hidden max-w-sm flex-1 justify-center md:flex lg:mx-4">
                        <div className="relative w-full">
                            <Search
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
                                strokeWidth={1.75}
                            />
                            <input
                                ref={searchRef}
                                id="lw-global-search"
                                type="search"
                                name="lw-global-search"
                                placeholder="Search…"
                                autoComplete="off"
                                aria-label="Global search"
                                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg)] py-2 pl-9 pr-14 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] transition-shadow duration-1 ease-lw focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-400/20"
                            />
                            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--text-3)] sm:inline">
                                ⌘K
                            </kbd>
                        </div>
                    </div>

                    <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                        {primaryAction ? (
                            <div className="min-w-0 max-w-[min(100%,12rem)] sm:max-w-none">{primaryAction}</div>
                        ) : null}
                        {profileMenu}
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 h-[var(--topbar-h)] min-h-[var(--topbar-h)] border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-md">
            <div className="flex h-full w-full items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-2">
                    <Link
                        to={logoLink}
                        className="truncate text-[var(--text)] transition-colors duration-1 ease-lw hover:text-brass-400"
                    >
                        <Wordmark size="md" />
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {loginDetails ? (
                        profileMenu
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 rounded-md bg-brass-400 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors duration-1 ease-lw hover:bg-brass-500"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>Sign in</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DashNav;
