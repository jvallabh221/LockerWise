import React from "react";

/** §7.3 — 16px, 4px radius, native accent via .lw-checkbox */
export const Checkbox = ({
    id,
    label,
    checked,
    onChange,
    disabled = false,
    className = "",
}) => (
    <label
        htmlFor={id}
        className={`inline-flex cursor-pointer items-start gap-2.5 ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
        <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="lw-checkbox mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-strong)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]"
        />
        {label ? <span className="text-sm leading-snug text-[var(--text)]">{label}</span> : null}
    </label>
);

export default Checkbox;
