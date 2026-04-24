import React from "react";

/**
 * Status chip — §7.4
 * Leading dot + optional aria-label for state (not color-only).
 *
 * Locker lifecycle: available → success, occupied → info (sky), expiring → warning,
 * expired → error, maintenance → neutral, pending → outlined neutral
 */

const DOT = {
    active:    "bg-success-500",
    success:   "bg-success-500",
    available: "bg-success-500",
    info:      "bg-brass-400",
    accent:    "bg-brass-400",
    occupied:  "bg-brass-400",
    warning:   "bg-warning-500",
    expiring:  "bg-warning-500",
    "expiring soon": "bg-warning-500",
    error:     "bg-error-500",
    expired:   "bg-error-500",
    flag:      "bg-error-500",
    overdue:   "bg-error-500",
    neutral:       "bg-slate-400",
    muted:         "bg-slate-400",
    unassigned:    "bg-slate-400",
    maintenance:   "bg-slate-400",
    pending:       "bg-[var(--text-3)]",
    navy:      "bg-ink-900",
    brass:     "bg-brass-400",
    default:   "bg-ink-900",
};

const TONES = {
    active:    "bg-success-50 text-success-700 border border-success-500/30",
    success:   "bg-success-50 text-success-700 border border-success-500/30",
    available: "bg-success-50 text-success-700 border border-success-500/30",
    info:      "bg-brass-50 text-brass-500 border border-brass-400/30",
    accent:    "bg-brass-50 text-brass-500 border border-brass-400/30",
    occupied:  "bg-brass-50 text-brass-500 border border-brass-400/30",
    warning:   "bg-warning-50 text-warning-700 border border-warning-500/30",
    expiring:  "bg-warning-50 text-warning-700 border border-warning-500/30",
    "expiring soon": "bg-warning-50 text-warning-700 border border-warning-500/30",
    error:     "bg-error-50 text-error-700 border border-error-500/30",
    expired:   "bg-error-50 text-error-700 border border-error-500/30",
    flag:      "bg-error-50 text-error-700 border border-error-500/30",
    overdue:   "bg-error-50 text-error-700 border border-error-500/30",
    neutral:       "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]",
    muted:         "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]",
    unassigned:    "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]",
    maintenance:   "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]",
    pending:       "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border-strong)]",
    navy:      "bg-ink-900 text-white border border-ink-900",
    brass:     "bg-brass-50 text-brass-500 border border-brass-400/30",
    default:   "bg-ink-900 text-white border border-ink-900",
};

/** Map raw locker status string → Badge tone */
export function lockerStatusToTone(status) {
    if (!status) return "neutral";
    const s = String(status).toLowerCase().trim();
    if (s.includes("avail")) return "available";
    if (s.includes("occup") || s.includes("assign") || s.includes("in use")) return "occupied";
    if (s.includes("expir")) return "expiring";
    if (s.includes("expired")) return "expired";
    if (s.includes("maint")) return "maintenance";
    if (s.includes("pend")) return "pending";
    return "neutral";
}

export const Badge = ({
    children,
    className = "",
    tone = "neutral",
    size = "md",
    dot = true,
    "aria-label": ariaLabel,
}) => {
    const toneStyles = TONES[tone] || TONES.neutral;
    const dotStyles = DOT[tone] || DOT.neutral;
    const sizeStyles =
        size === "sm" ? "px-2 py-0.5 text-[12px] leading-tight" : "px-2.5 py-1 text-xs leading-tight";

    return (
        <span
            role="status"
            aria-label={ariaLabel}
            className={`inline-flex max-w-full items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${sizeStyles} ${toneStyles} ${className}`}
        >
            {dot ? (
                <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles}`}
                    aria-hidden
                />
            ) : null}
            <span className="truncate">{children}</span>
        </span>
    );
};

export default Badge;
