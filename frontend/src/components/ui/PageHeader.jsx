import React from "react";

/**
 * Page header — §7.14
 * Optional breadcrumb slot → H3 → 13px subtitle → right actions. mb-5 (20px).
 */
export const PageHeader = ({
    breadcrumb,
    title,
    subtitle,
    actions,
    className = "",
}) => (
    <header
        className={`mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
        <div className="min-w-0 flex-1">
            {breadcrumb ? <div className="mb-2">{breadcrumb}</div> : null}
            <h2 className="font-display text-[22px] font-medium leading-7 tracking-tight text-[var(--text)]">
                {title}
            </h2>
            {subtitle ? (
                <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--text-2)]">
                    {subtitle}
                </p>
            ) : null}
        </div>
        {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">{actions}</div>
        ) : null}
    </header>
);

export default PageHeader;
