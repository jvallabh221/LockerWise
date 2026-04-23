import React from "react";

const TONES = {
    default: "bg-ink-900 text-cream-50",
    occupied: "bg-brass-200 text-ink-900 border border-brass-400",
    available: "bg-[#e6efe8] text-[#2f5c43] border border-[#b9d3c1]",
    expired: "bg-[#f3d8cf] text-[#7a2a18] border border-[#d58874]",
    flag: "bg-[#f3d8cf] text-[#7a2a18] border border-[#d58874]",
    maintenance: "bg-slate-100 text-ink-900 border border-slate-200",
    muted: "bg-cream-100 text-ink-900 border border-ink-900/10",
    brass: "bg-brass-400 text-ink-900",
};

export const Badge = ({ children, className = "", tone = "default" }) => {
    const toneStyles = TONES[tone] || TONES.default;
    return (
        <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[0.65rem] font-mono uppercase tracking-editorial rounded-sm ${toneStyles} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
