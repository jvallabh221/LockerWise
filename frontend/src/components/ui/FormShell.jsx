import React from "react";
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";

/**
 * LockerWise FormShell — v2 (modern institutional SaaS)
 *
 * Composition helpers used across most pages.
 *
 * Backward compatibility:
 *   - <PageShell eyebrow title italicTitle description rightMeta />  still works.
 *     `italicTitle` is rendered as a second word (no more italic treatment).
 *   - `<FormCard num="§ 02" title="..." />` still works; `num` is rendered
 *     as an uppercase eyebrow above the title.
 */

/* -------------------------------- PageShell ---------------------------- */

export const PageShell = ({ eyebrow, title, italicTitle, description, rightMeta, children, actions }) => (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-6 lg:py-10">
        <header className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
                {eyebrow ? <div className="lw-eyebrow mb-2">{eyebrow}</div> : null}
                <h1 className="font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--text)] sm:text-[2rem] lg:text-[2.25rem]">
                    {title}{italicTitle ? <span className="text-brass-500"> {italicTitle}</span> : null}
                </h1>
                {description ? (
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--text-2)]">
                        {description}
                    </p>
                ) : null}
            </div>
            {(actions || rightMeta) ? (
                <div className="flex items-center gap-3 flex-shrink-0">
                    {rightMeta}
                    {actions}
                </div>
            ) : null}
        </header>
        {children}
    </section>
);

/* --------------------------------- FormCard ---------------------------- */

export const FormCard = ({ children, num, title, description, className = "", padding = "default" }) => {
    const padCls = padding === "none" ? "" : padding === "tight" ? "p-5" : "p-6 sm:p-8";
    return (
        <div
            className={`mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-none ${padCls} ${className}`}
        >
            {(num || title || description) ? (
                <div className="mb-6">
                    {num ? <div className="lw-eyebrow mb-1">{num}</div> : null}
                    {title ? (
                        <h2 className="font-display text-xl font-semibold leading-tight text-[var(--text)] sm:text-[1.375rem]">
                            {title}
                        </h2>
                    ) : null}
                    {description ? (
                        <p className="mt-2 max-w-2xl text-sm text-[var(--text-2)]">{description}</p>
                    ) : null}
                </div>
            ) : null}
            {children}
        </div>
    );
};

/* ------------------------------- Field parts --------------------------- */

export const FieldRow = ({ label, htmlFor, children, hint, error, required, span = 1 }) => (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
        {label ? (
            <label htmlFor={htmlFor} className="lw-label">
                {label}{required ? <span className="text-error-500 ml-0.5">*</span> : null}
            </label>
        ) : null}
        {children}
        {error ? (
            <p className="mt-1.5 text-xs text-error-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
            </p>
        ) : hint ? (
            <p className="lw-hint">{hint}</p>
        ) : null}
    </div>
);

export const FieldGrid = ({ children, cols = 2, className = "" }) => {
    const colsCls = cols === 1 ? "sm:grid-cols-1"
        : cols === 3 ? "sm:grid-cols-3"
        : cols === 4 ? "sm:grid-cols-4"
        : "sm:grid-cols-2";
    return (
        <div className={`grid grid-cols-1 ${colsCls} gap-x-6 gap-y-5 ${className}`}>
            {children}
        </div>
    );
};

/* ------------------------------- Banners ------------------------------- */

export const ErrorBanner = ({ children, title }) =>
    children ? (
        <div
            className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--border)] border-l-[3px] border-l-error-500 bg-[var(--error-bg)] px-4 py-3 text-error-700"
            role="alert"
        >
            <AlertTriangle className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
                {title ? (
                    <div className="mb-0.5 text-[13.5px] font-semibold leading-snug text-error-700">{title}</div>
                ) : null}
                <div className="text-[13px] font-normal leading-relaxed text-[var(--text-2)]">{children}</div>
            </div>
        </div>
    ) : null;

export const SuccessBanner = ({ children, title }) =>
    children ? (
        <div
            className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--border)] border-l-[3px] border-l-success-500 bg-[var(--success-bg)] px-4 py-3 text-success-700"
            role="status"
        >
            <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
                {title ? (
                    <div className="mb-0.5 text-[13.5px] font-semibold leading-snug text-success-700">{title}</div>
                ) : null}
                <div className="text-[13px] font-normal leading-relaxed text-[var(--text-2)]">{children}</div>
            </div>
        </div>
    ) : null;

export const WarningBanner = ({ children, title }) =>
    children ? (
        <div
            className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--border)] border-l-[3px] border-l-warning-500 bg-[var(--warning-bg)] px-4 py-3 text-warning-700"
            role="status"
        >
            <AlertTriangle className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
                {title ? (
                    <div className="mb-0.5 text-[13.5px] font-semibold leading-snug text-warning-700">{title}</div>
                ) : null}
                <div className="text-[13px] font-normal leading-relaxed text-[var(--text-2)]">{children}</div>
            </div>
        </div>
    ) : null;

export const InfoBanner = ({ children, title }) =>
    children ? (
        <div
            className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--border)] border-l-[3px] border-l-brass-400 bg-[var(--info-bg)] px-4 py-3 text-brass-600"
            role="status"
        >
            <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brass-500" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
                {title ? (
                    <div className="mb-0.5 text-[13.5px] font-semibold leading-snug text-brass-600">{title}</div>
                ) : null}
                <div className="text-[13px] font-normal leading-relaxed text-[var(--text-2)]">{children}</div>
            </div>
        </div>
    ) : null;

/* ---------------------------- ReadonlyBlock ---------------------------- */

export const ReadonlyBlock = ({ title, items }) => (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
        {title ? <div className="lw-eyebrow mb-3">{title}</div> : null}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {items.map((it) => (
                <div key={it.label}>
                    <dt className="mb-0.5 text-xs font-medium text-[var(--text-3)]">{it.label}</dt>
                    <dd className="break-words text-sm font-medium text-[var(--text)]">
                        {it.value || <span className="text-[var(--text-3)]">—</span>}
                    </dd>
                </div>
            ))}
        </dl>
    </div>
);

/* ----------------------------- FormActions ----------------------------- */

export const FormActions = ({ children, align = "end" }) => (
    <div
        className={`mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-5 ${
            align === "between" ? "justify-between" : align === "start" ? "justify-start" : "justify-end"
        }`}
    >
        {children}
    </div>
);

/* ------------------------------ EmptyState ----------------------------- */

export const EmptyState = ({ title = "Nothing here yet", description, icon: Icon, action }) => (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
        {Icon ? (
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-3)]">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
        ) : null}
        <h3 className="font-display text-base font-medium leading-[22px] text-[var(--text)]">{title}</h3>
        {description ? (
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-2)]">{description}</p>
        ) : null}
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
);

/* ------------------------------ LoadingRow ----------------------------- */

export const LoadingState = ({ label = "Loading…" }) => (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--border)] border-t-brass-400"
            aria-hidden
        />
        <p className="text-sm text-[var(--text-2)]">{label}</p>
    </div>
);

export default PageShell;
