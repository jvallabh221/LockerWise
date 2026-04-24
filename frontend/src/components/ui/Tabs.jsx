import React from "react";

/**
 * Underline tabs — §7.9
 * @param {{ id: string, label: string }[]} tabs
 * @param {string} activeId
 * @param {(id: string) => void} onChange
 */
export const Tabs = ({ tabs = [], activeId, onChange, className = "" }) => (
    <div className={`border-b border-[var(--border)] ${className}`} role="tablist">
        <div className="-mb-px flex flex-wrap gap-6">
            {tabs.map((t) => {
                const active = t.id === activeId;
                return (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        id={`tab-${t.id}`}
                        aria-selected={active}
                        aria-controls={`panel-${t.id}`}
                        tabIndex={active ? 0 : -1}
                        onClick={() => onChange?.(t.id)}
                        className={`border-b-2 pb-3 text-sm transition-colors duration-1 ease-lw focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus-visible:rounded-sm ${
                            active
                                ? "border-brass-400 font-medium text-[var(--text)]"
                                : "border-transparent font-normal text-[var(--text-2)] hover:text-[var(--text)]"
                        }`}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    </div>
);

export const TabPanel = ({ id, activeId, children, className = "" }) => {
    if (id !== activeId) return null;
    return (
        <div
            id={`panel-${id}`}
            role="tabpanel"
            aria-labelledby={`tab-${id}`}
            className={`pt-6 ${className}`}
        >
            {children}
        </div>
    );
};

export default Tabs;
