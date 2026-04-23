import React from "react";

export const Card = ({ children, className, onClick }) => {
    return (
        <div className={`bg-white shadow-md rounded-[1.2rem] ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className }) => {
    return <div className={`${className}`}>{children}</div>;
};
