import React from "react";
import { Search, X } from "lucide-react";

/**
 * LockerWise SearchInput — v2
 *
 * Standard search field with accent focus ring and optional clear button.
 * Use this everywhere we have a "filter rows by query" input.
 */
export const SearchInput = ({
    value,
    onChange,
    placeholder = "Search…",
    className = "",
    width = "w-full sm:w-80",
    size = "md",
}) => {
    const sizeCls = size === "sm"
        ? "py-1.5 pl-9 pr-8 text-sm"
        : "py-2 pl-9 pr-8 text-sm";

    return (
        <div className={`relative ${width} ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${sizeCls} bg-white border border-ink-100 rounded-md text-ink-900 placeholder:text-slate-400 focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 transition-colors`}
            />
            {value ? (
                <button
                    type="button"
                    onClick={() => onChange?.({ target: { value: "" } })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-ink-900 transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            ) : null}
        </div>
    );
};

export default SearchInput;
