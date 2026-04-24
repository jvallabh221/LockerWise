import React from "react";

/** §7.12 — subtle shimmer, 1.2s linear, no bounce */
export const Skeleton = ({ className = "", style }) => (
    <div
        className={`animate-lw-shimmer rounded-md bg-[var(--border)] ${className}`}
        style={style}
        aria-hidden
    />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                className="h-3 w-full"
                style={{ width: i === lines - 1 ? "72%" : "100%" }}
            />
        ))}
    </div>
);

export default Skeleton;
