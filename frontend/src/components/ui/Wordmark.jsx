import React from "react";

/**
 * LockerWise wordmark + 2x2 locker-bank mark.
 * v2: navy outline, accent-blue highlight dot.
 */
export const Wordmark = ({ className = "", showMark = true, size = "md" }) => {
    const markSize = size === "sm" ? 20 : size === "lg" ? 32 : 26;
    const textSize =
        size === "sm"
            ? "text-lg"
            : size === "lg"
            ? "text-2xl"
            : "text-xl";

    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            {showMark ? (
                <svg
                    width={markSize}
                    height={markSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="13" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="1" y="13" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="13" y="13" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="6"  cy="6"  r="1.15" fill="currentColor" />
                    <circle cx="18" cy="6"  r="1.15" fill="currentColor" />
                    <circle cx="6"  cy="18" r="1.15" fill="currentColor" />
                    <circle cx="18" cy="18" r="1.6"  fill="#0EA5E9" />
                </svg>
            ) : null}
            <span className={`font-display font-semibold tracking-tight ${textSize}`}>LockerWise</span>
        </span>
    );
};

export default Wordmark;
