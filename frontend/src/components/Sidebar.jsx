import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ items, role }) => {
    const location = useLocation();

    return (
        <div className="group w-16 hover:w-72 transition-all duration-300 overflow-hidden flex flex-col rounded-l-none rounded-r-2xl fixed top-1/4 left-0 z-40" style={{ height: 'calc(100vh - 80px)' }}>
            <nav className=" space-y-1 flex-1 mt-12">
                <div className="bg-gray-400/50 backdrop-blur-sm rounded-r-2xl p-2 space-y-1" style={{ minHeight: 'fit-content' }}>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-purple-100 text-purple-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                            title={item.title}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

