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
    <section className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
        <header className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0 flex-1">
                {eyebrow ? <div className="lw-eyebrow mb-2">{eyebrow}</div> : null}
                <h1 className="font-display text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] text-ink-900 font-semibold leading-[1.15] tracking-tight">
                    {title}{italicTitle ? <span className="text-brass-500"> {italicTitle}</span> : null}
                </h1>
                {description ? (
                    <p className="mt-3 text-slate-500 max-w-2xl leading-relaxed text-[0.95rem]">
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
        <div className={`mt-6 bg-white border border-ink-100 rounded-xl shadow-paper ${padCls} ${className}`}>
            {(num || title || description) ? (
                <div className="mb-6">
                    {num ? <div className="lw-eyebrow mb-1">{num}</div> : null}
                    {title ? (
                        <h2 className="font-display text-xl sm:text-[1.375rem] text-ink-900 font-semibold leading-tight">
                            {title}
                        </h2>
                    ) : null}
                    {description ? (
                        <p className="mt-2 text-sm text-slate-500 max-w-2xl">{description}</p>
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
        <div className="mt-5 flex items-start gap-2.5 border border-error-500/25 bg-error-50 text-error-700 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
                {title ? <div className="font-semibold mb-0.5">{title}</div> : null}
                <div>{children}</div>
            </div>
        </div>
    ) : null;

export const SuccessBanner = ({ children, title }) =>
    children ? (
        <div className="mt-5 flex items-start gap-2.5 border border-success-500/25 bg-success-50 text-success-700 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
                {title ? <div className="font-semibold mb-0.5">{title}</div> : null}
                <div>{children}</div>
            </div>
        </div>
    ) : null;

export const InfoBanner = ({ children, title }) =>
    children ? (
        <div className="mt-5 flex items-start gap-2.5 border border-brass-400/25 bg-brass-50 text-brass-600 rounded-lg px-4 py-3">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
                {title ? <div className="font-semibold mb-0.5">{title}</div> : null}
                <div>{children}</div>
            </div>
        </div>
    ) : null;

/* ---------------------------- ReadonlyBlock ---------------------------- */

export const ReadonlyBlock = ({ title, items }) => (
    <div className="border border-ink-100 bg-cream-200/60 rounded-lg p-5">
        {title ? <div className="lw-eyebrow mb-3">{title}</div> : null}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {items.map((it) => (
                <div key={it.label}>
                    <dt className="text-xs font-medium text-slate-500 mb-0.5">{it.label}</dt>
                    <dd className="text-sm text-ink-900 font-medium break-words">
                        {it.value || <span className="text-slate-300">—</span>}
                    </dd>
                </div>
            ))}
        </dl>
    </div>
);

/* ----------------------------- FormActions ----------------------------- */

export const FormActions = ({ children, align = "end" }) => (
    <div className={`mt-8 pt-5 border-t border-ink-100 flex items-center gap-3 flex-wrap ${
        align === "between" ? "justify-between" :
        align === "start" ? "justify-start" :
        "justify-end"
    }`}>
        {children}
    </div>
);

/* ------------------------------ EmptyState ----------------------------- */

export const EmptyState = ({ title = "Nothing here yet", description, icon: Icon, action }) => (
    <div className="py-12 px-6 text-center">
        {Icon ? (
            <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-cream-200 text-slate-400">
                <Icon className="w-5 h-5" />
            </div>
        ) : null}
        <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
        {description ? (
            <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">{description}</p>
        ) : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
);

/* ------------------------------ LoadingRow ----------------------------- */

export const LoadingState = ({ label = "Loading…" }) => (
    <div className="py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-ink-100 border-t-brass-400 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">{label}</p>
    </div>
);

export default PageShell;
