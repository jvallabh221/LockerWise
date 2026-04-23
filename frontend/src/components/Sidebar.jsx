import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ items, role }) => {
    const location = useLocation();

    return (
        <aside
            className="group w-16 hover:w-72 transition-all duration-300 overflow-hidden flex flex-col fixed top-20 left-0 z-40 bg-cream-50 border-r border-ink-900/10"
            style={{ height: "calc(100vh - 80px)" }}
        >
            <div className="px-3 pt-6 pb-3">
                <div className="lw-eyebrow hidden group-hover:block">
                    {role ? `${role} Menu` : "Menu"}
                </div>
            </div>
            <nav className="flex-1 px-2 space-y-0.5">
                {items.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    const num = String(idx + 1).padStart(2, "0");
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={item.title}
                            className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors ${
                                isActive
                                    ? "bg-ink-900 text-cream-50"
                                    : "text-ink-900 hover:bg-ink-900/5"
                            }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span
                                className={`font-mono text-[0.65rem] uppercase tracking-editorial whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isActive ? "text-brass-300" : "text-slate-500"
                                }`}
                            >
                                {num}
                            </span>
                            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            <div className="px-4 py-4 border-t border-ink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="lw-eyebrow">LockerWise / v1</div>
            </div>
        </aside>
    );
};

export default Sidebar;
