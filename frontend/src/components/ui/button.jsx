import React from "react";

/**
 * LockerWise Button — §7.1
 *
 * Variants: primary (navy), accent (sky — page hero CTA), secondary, ghost, danger
 * Legacy: brass → accent, navy kept, outline → secondary, primary-old sky → use accent via brass alias
 */

const VARIANTS = {
    primary:
        "bg-ink-900 text-white border border-ink-900 hover:bg-ink-700 hover:border-ink-700 active:bg-ink-800 shadow-xs",
    accent:
        "bg-brass-400 text-white border border-brass-400 hover:bg-[#0284C7] hover:border-[#0284C7] active:bg-brass-600 shadow-xs",
    secondary:
        "bg-[var(--surface)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--bg)] active:bg-[var(--surface-2)]",
    ghost:
        "bg-transparent text-[var(--text)] border border-transparent hover:bg-[var(--bg)] active:bg-[var(--surface-2)]",
    danger:
        "bg-error-500 text-white border border-error-500 hover:bg-error-600 hover:border-error-600 active:bg-error-700 shadow-xs",
    brass:
        "bg-brass-400 text-white border border-brass-400 hover:bg-[#0284C7] hover:border-[#0284C7] active:bg-brass-600 shadow-xs",
    navy:
        "bg-ink-900 text-white border border-ink-900 hover:bg-ink-700 hover:border-ink-700 active:bg-ink-800 shadow-xs",
    outline:
        "bg-[var(--surface)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--bg)] active:bg-[var(--surface-2)]",
};

const SIZES = {
    sm: "px-3 py-[7px] text-[13px] leading-none",
    md: "px-[18px] py-2.5 text-sm leading-none",
    lg: "px-[22px] py-3.5 text-[15px] leading-none",
};

const focusRing =
    "focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]";

export const Button = ({
    children,
    className = "",
    onClick,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    loading = false,
    ...rest
}) => {
    const variantStyles = VARIANTS[variant] || VARIANTS.primary;
    const sizeStyles = SIZES[size] || SIZES.md;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`relative inline-flex min-h-0 items-center justify-center gap-2 font-medium rounded-md transition-colors duration-1 ease-lw disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${focusRing} ${sizeStyles} ${variantStyles} ${className}`}
            {...rest}
        >
            {loading ? (
                <span
                    className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/35 border-t-white"
                    aria-hidden
                />
            ) : null}
            {loading ? <span className="sr-only">Loading</span> : null}
            <span className={loading ? "invisible" : ""}>{children}</span>
        </button>
    );
};

export default Button;
