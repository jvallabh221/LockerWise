import React from "react";

/**
 * LockerWise Badge — v2
 *
 * Semantic tones (preferred):
 *   active, success, available   → green
 *   info, accent                 → accent blue
 *   warning, occupied            → amber
 *   error, expired, flag, overdue → red
 *   neutral, muted, unassigned, maintenance → cool neutral
 *   navy                         → deep brand navy
 *
 * Back-compat tones (existing pages): brass, default
 */

const TONES = {
    // Semantic
    active:    "bg-success-50 text-success-700 border border-success-500/30",
    success:   "bg-success-50 text-success-700 border border-success-500/30",
    available: "bg-success-50 text-success-700 border border-success-500/30",

    info:      "bg-brass-50 text-brass-500 border border-brass-400/30",
    accent:    "bg-brass-50 text-brass-500 border border-brass-400/30",

    warning:   "bg-warning-50 text-warning-700 border border-warning-500/30",
    occupied:  "bg-warning-50 text-warning-700 border border-warning-500/30",
    "expiring soon": "bg-warning-50 text-warning-700 border border-warning-500/30",

    error:     "bg-error-50 text-error-700 border border-error-500/30",
    expired:   "bg-error-50 text-error-700 border border-error-500/30",
    flag:      "bg-error-50 text-error-700 border border-error-500/30",
    overdue:   "bg-error-50 text-error-700 border border-error-500/30",

    neutral:       "bg-cream-200 text-slate-500 border border-ink-100",
    muted:         "bg-cream-200 text-slate-500 border border-ink-100",
    unassigned:    "bg-cream-200 text-slate-500 border border-ink-100",
    maintenance:   "bg-cream-200 text-slate-500 border border-ink-100",

    navy:      "bg-ink-900 text-white border border-ink-900",

    // Legacy aliases
    brass:     "bg-brass-50 text-brass-500 border border-brass-400/30",
    default:   "bg-ink-900 text-white border border-ink-900",
};

export const Badge = ({ children, className = "", tone = "neutral", size = "md" }) => {
    const toneStyles = TONES[tone] || TONES.neutral;
    const sizeStyles = size === "sm"
        ? "px-2 py-0.5 text-[0.65rem]"
        : "px-2.5 py-0.5 text-xs";

    return (
        <span
            className={`inline-flex items-center justify-center gap-1 font-medium rounded-full whitespace-nowrap ${sizeStyles} ${toneStyles} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
