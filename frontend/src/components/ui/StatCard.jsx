import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * KPI / stat card — §7.7
 */
export const StatCard = ({
    label,
    value,
    hint,
    delta,
    deltaDirection = "flat",
    icon: Icon,
    className = "",
}) => {
    const DeltaIcon =
        deltaDirection === "up" ? TrendingUp : deltaDirection === "down" ? TrendingDown : Minus;
    const deltaCls =
        deltaDirection === "up"
            ? "text-success-600"
            : deltaDirection === "down"
              ? "text-error-600"
              : "text-[var(--text-3)]";

    return (
        <div
            className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-none ${className}`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="text-[11.5px] font-medium leading-tight text-[var(--text-3)]">{label}</span>
                {Icon ? (
                    <Icon
                        className="h-3.5 w-3.5 shrink-0 text-[var(--text-3)]"
                        strokeWidth={1.75}
                        aria-hidden
                    />
                ) : null}
            </div>
            <div className="mt-2 font-display text-[26px] font-medium leading-none tracking-tight text-[var(--text)]">
                {value}
            </div>
            {hint ? <div className="mt-1.5 text-xs text-[var(--text-3)]">{hint}</div> : null}
            {delta != null && delta !== "" ? (
                <div
                    className={`mt-3 flex items-center gap-1 font-mono text-[10.5px] font-medium ${deltaCls}`}
                >
                    <DeltaIcon className="h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden />
                    <span>{delta}</span>
                </div>
            ) : null}
        </div>
    );
};

export default StatCard;
