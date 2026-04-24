import React from "react";

export const Card = ({ children, className = "", onClick, as: Component = "div" }) => {
    return (
        <Component
            className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-none ${
                onClick
                    ? "cursor-pointer transition-shadow duration-1 ease-lw hover:shadow-sm"
                    : ""
            } ${className}`}
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
        <div
            className={`flex items-start justify-between gap-4 border-b border-[var(--border)] px-[18px] py-3.5 ${className}`}
        >
            <div className="min-w-0">
                {eyebrow ? <div className="lw-eyebrow mb-1.5">{eyebrow}</div> : null}
                {title ? (
                    <h3 className="font-display text-base font-medium leading-[22px] tracking-tight text-[var(--text)]">
                        {title}
                    </h3>
                ) : null}
                {children}
            </div>
            {action ? <div className="flex-shrink-0">{action}</div> : null}
        </div>
    );
};

export const CardFooter = ({ children, className = "" }) => {
    return (
        <div
            className={`rounded-b-lg border-t border-[var(--border)] bg-[var(--surface-2)]/80 px-6 py-4 ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
