import React from "react";

export const Card = ({ children, className = "", onClick, as: Component = "div" }) => {
    return (
        <Component
            className={`bg-white border border-ink-100 rounded-xl shadow-paper ${onClick ? "cursor-pointer transition-shadow hover:shadow-pop" : ""} ${className}`}
            onClick={onClick}
        >
            {children}
        </Component>
    );
};

export const CardContent = ({ children, className = "" }) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardHeader = ({ children, className = "", eyebrow, title, action }) => {
    return (
        <div className={`px-6 pt-5 pb-4 border-b border-ink-100 flex items-start justify-between gap-4 ${className}`}>
            <div className="min-w-0">
                {eyebrow ? <div className="lw-eyebrow mb-1.5">{eyebrow}</div> : null}
                {title ? (
                    <h3 className="font-display text-lg font-semibold text-ink-900 leading-tight">{title}</h3>
                ) : null}
                {children}
            </div>
            {action ? <div className="flex-shrink-0">{action}</div> : null}
        </div>
    );
};

export const CardFooter = ({ children, className = "" }) => {
    return (
        <div className={`px-6 py-4 border-t border-ink-100 bg-cream-100/70 rounded-b-xl ${className}`}>
            {children}
        </div>
    );
};

export default Card;
