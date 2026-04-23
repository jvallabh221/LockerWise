import React from "react";

export const Button = ({ children, className, onClick, variant = "primary" }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium";
    const variantStyles = variant === "ghost" ? "bg-transparent text-gray-600 hover:bg-gray-100" : "bg-gray-400 text-black hover:bg-gray-500";

    return (
        <button className={`${baseStyles} ${variantStyles} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};
