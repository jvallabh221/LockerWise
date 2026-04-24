import React, { useId } from "react";

/** §7.3 — 32×18 pill, off = border-strong, on = brand-500 */
export const Toggle = ({ id: idProp, checked, onChange, label, disabled = false, className = "" }) => {
    const uid = useId();
    const id = idProp ?? uid;
    return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-1 ease-lw focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] disabled:cursor-not-allowed disabled:opacity-50 ${
                checked ? "bg-brass-400" : "bg-[var(--border-strong)]"
            }`}
        >
            <span
                className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-1 ease-lw ${
                    checked ? "left-[15px]" : "left-0.5"
                }`}
            />
        </button>
        {label ? (
            <label htmlFor={id} className="cursor-pointer select-none text-sm text-[var(--text)]">
                {label}
            </label>
        ) : null}
    </div>
    );
};

export default Toggle;
