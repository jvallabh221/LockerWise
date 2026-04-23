import React from "react";

export const Card = ({ children, className = "", onClick }) => {
    return (
        <div
            className={`bg-white border border-ink-900/10 rounded-sm shadow-paper ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = "" }) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardHeader = ({ children, className = "", eyebrow }) => {
    return (
        <div className={`px-6 pt-6 pb-4 border-b border-ink-900/10 ${className}`}>
            {eyebrow ? <div className="lw-eyebrow mb-2">{eyebrow}</div> : null}
            {children}
        </div>
    );
};

export default Card;
