import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ items, role }) => {
    const location = useLocation();

    return (
        <aside
            className="group fixed top-16 left-0 z-40 w-[72px] hover:w-64 transition-[width] duration-300 ease-out overflow-hidden flex flex-col bg-white border-r border-ink-100"
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
                    const isActive =
                        location.pathname === item.path ||
                        (item.path !== "/" && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={item.title}
                            className={`relative flex items-center gap-3 h-10 px-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-brass-50 text-brass-600"
                                    : "text-slate-500 hover:bg-cream-200 hover:text-ink-900"
                            }`}
                        >
                            {isActive ? (
                                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brass-400 rounded-r-full" />
                            ) : null}
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-brass-500" : ""}`} />
                            <span
                                className={`text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    isActive ? "text-brass-600" : "text-ink-900"
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
    );
};

export default Sidebar;
