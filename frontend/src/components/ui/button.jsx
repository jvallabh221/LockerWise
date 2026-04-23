import React from "react";

/**
 * LockerWise Button — v2
 *
 * Variants:
 *   primary   — accent blue (default interactive)
 *   navy      — deep brand navy (anchor actions)
 *   secondary — neutral outlined (alt / cancel)
 *   ghost     — transparent text action
 *   danger    — destructive red
 *
 * Legacy variant aliases (kept for back-compat with existing pages):
 *   brass  → primary
 *   outline → secondary
 *
 * Sizes: sm | md | lg
 */

const VARIANTS = {
    primary:
        "bg-brass-400 text-white border border-brass-400 hover:bg-brass-500 hover:border-brass-500 active:bg-brass-600 shadow-xs",
    navy:
        "bg-ink-900 text-white border border-ink-900 hover:bg-ink-700 active:bg-ink-800 shadow-xs",
    secondary:
        "bg-white text-ink-900 border border-ink-100 hover:bg-cream-200 hover:border-ink-200 active:bg-cream-300",
    ghost:
        "bg-transparent text-ink-900 border border-transparent hover:bg-cream-200 active:bg-cream-300",
    danger:
        "bg-error-500 text-white border border-error-500 hover:bg-error-600 hover:border-error-600 active:bg-error-700 shadow-xs",
    // Legacy aliases — existing code keeps working
    brass:   "bg-brass-400 text-white border border-brass-400 hover:bg-brass-500 hover:border-brass-500 active:bg-brass-600 shadow-xs",
    outline: "bg-white text-ink-900 border border-ink-100 hover:bg-cream-200 hover:border-ink-200 active:bg-cream-300",
};

const SIZES = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
};

export const Button = ({
    children,
    className = "",
    onClick,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    ...rest
}) => {
    const variantStyles = VARIANTS[variant] || VARIANTS.primary;
    const sizeStyles = SIZES[size] || SIZES.md;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${sizeStyles} ${variantStyles} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
