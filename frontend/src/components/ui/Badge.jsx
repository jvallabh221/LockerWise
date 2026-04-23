import React from "react";

export const Badge = ({ children, className }) => {
    return <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-gray-600 rounded-full ${className}`}>{children}</span>;
};
