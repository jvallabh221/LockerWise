import React from "react";

/**
 * LockerWise wordmark.
 *
 * Mark — 2×2 grid of rounded-square compartments. The top-right
 * compartment is filled with `--brand-500` (spec §5). The other three
 * are outlined in currentColor, so the mark picks up its surface color
 * automatically (navy on light surfaces, white on dark/navy surfaces).
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
                    {/* Top-left */}
                    <rect x="1"  y="1"  width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    {/* Top-right — accent, filled rounded square */}
                    <rect x="13" y="1"  width="10" height="10" rx="1.5" fill="var(--brand-500)" />
                    {/* Bottom-left */}
                    <rect x="1"  y="13" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    {/* Bottom-right */}
                    <rect x="13" y="13" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
            ) : null}
            <span className={`font-display font-semibold tracking-tight ${textSize}`}>LockerWise</span>
        </span>
    );
};

export default Wordmark;
