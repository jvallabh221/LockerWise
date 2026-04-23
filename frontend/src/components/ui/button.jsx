import React from "react";

const VARIANTS = {
    primary:
        "bg-ink-900 text-cream-50 hover:bg-ink-700 border border-ink-900",
    brass:
        "bg-brass-400 text-ink-900 hover:bg-brass-500 hover:text-cream-50 border border-brass-500",
    ghost:
        "bg-transparent text-ink-900 hover:bg-ink-900/5 border border-transparent",
    outline:
        "bg-transparent text-ink-900 hover:bg-ink-900 hover:text-cream-50 border border-ink-900",
    danger:
        "bg-[#b5452c] text-cream-50 hover:bg-[#8f3622] border border-[#8f3622]",
};

export const Button = ({
    children,
    className = "",
    onClick,
    variant = "primary",
    type = "button",
    disabled = false,
    ...rest
}) => {
    const variantStyles = VARIANTS[variant] || VARIANTS.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium uppercase tracking-editorial font-mono transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
