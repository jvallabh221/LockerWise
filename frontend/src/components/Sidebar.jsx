import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

/**
 * Responsive sidebar.
 *
 *  - Desktop (lg+): fixed 72px rail that expands to 256px on hover.
 *  - Mobile  (<lg): slide-in drawer (260px) with backdrop; controlled by
 *    the parent via `mobileOpen` + `onClose`. Pair with a hamburger
 *    button in the top bar (DashNav `onMenuClick`).
 */
const Sidebar = ({ items, role, mobileOpen = false, onClose }) => {
    const location = useLocation();

    // Close drawer whenever the route changes.
    useEffect(() => {
        if (mobileOpen && onClose) onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Close drawer on Escape.
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape" && onClose) onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [mobileOpen, onClose]);

    const isActive = (path) =>
        location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

    return (
        <>
            {/* ---------- DESKTOP RAIL (lg+) ---------- */}
            <aside
                className="group hidden lg:flex fixed top-16 left-0 z-40 w-[72px] hover:w-64 transition-[width] duration-300 ease-out overflow-hidden flex-col bg-white border-r border-ink-100"
                style={{ height: "calc(100vh - 64px)" }}
            >
                <div className="px-4 pt-5 pb-3">
                    <div className="lw-eyebrow opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {role ? `${role} menu` : "Menu"}
                    </div>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.title}
                                className={`relative flex items-center gap-3 h-10 px-3 rounded-lg transition-colors ${
                                    active
                                        ? "bg-brass-50 text-brass-600"
                                        : "text-slate-500 hover:bg-cream-200 hover:text-ink-900"
                                }`}
                            >
                                {active ? (
                                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brass-400 rounded-r-full" />
                                ) : null}
                                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-brass-500" : ""}`} />
                                <span
                                    className={`text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                        active ? "text-brass-600" : "text-ink-900"
                                    }`}
                                >
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-4 py-4 border-t border-ink-100">
                    <div className="lw-eyebrow opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        LockerWise · v1
                    </div>
                </div>
            </aside>

            {/* ---------- MOBILE DRAWER (<lg) ---------- */}
            {/* Backdrop */}
            <div
                onClick={onClose}
                aria-hidden={!mobileOpen}
                className={`lg:hidden fixed inset-0 top-16 z-40 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-200 ${
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />
            {/* Panel */}
            <aside
                className={`lg:hidden fixed top-16 left-0 z-50 w-[260px] bg-white border-r border-ink-100 shadow-pop flex flex-col transition-transform duration-250 ease-out ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ height: "calc(100vh - 64px)" }}
                aria-hidden={!mobileOpen}
            >
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    <div className="lw-eyebrow">{role ? `${role} menu` : "Menu"}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-1.5 rounded-md text-slate-500 hover:bg-cream-200 hover:text-ink-900 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`relative flex items-center gap-3 h-11 px-3 rounded-lg transition-colors ${
                                    active
                                        ? "bg-brass-50 text-brass-600"
                                        : "text-slate-500 hover:bg-cream-200 hover:text-ink-900"
                                }`}
                            >
                                {active ? (
                                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brass-400 rounded-r-full" />
                                ) : null}
                                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-brass-500" : ""}`} />
                                <span
                                    className={`text-sm font-medium ${
                                        active ? "text-brass-600" : "text-ink-900"
                                    }`}
                                >
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-4 py-4 border-t border-ink-100">
                    <div className="lw-eyebrow">LockerWise · v1</div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
