import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const PageShell = ({ eyebrow, title, italicTitle, description, rightMeta, children }) => (
    <section className="w-full max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
                {eyebrow ? <div className="lw-section-num mb-2">{eyebrow}</div> : null}
                <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-tight">
                    {title} {italicTitle ? <span className="italic">{italicTitle}</span> : null}
                </h1>
                <div className="lw-rule-brass w-16 mt-5 mb-2" />
                {description ? (
                    <p className="text-slate-600 max-w-xl leading-relaxed">{description}</p>
                ) : null}
            </div>
            {rightMeta ? <div>{rightMeta}</div> : null}
        </div>
        {children}
    </section>
);

export const FormCard = ({ children, num, title, className = "" }) => (
    <div className={`mt-8 border border-ink-900/10 bg-white p-6 sm:p-8 ${className}`}>
        {num || title ? (
            <div className="mb-6">
                {num ? <div className="lw-eyebrow mb-1">{num}</div> : null}
                {title ? <h2 className="font-display text-2xl text-ink-900">{title}</h2> : null}
            </div>
        ) : null}
        {children}
    </div>
);

export const FieldRow = ({ label, htmlFor, children, hint, span = 1 }) => (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
        <label htmlFor={htmlFor} className="lw-label">{label}</label>
        {children}
        {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </div>
);

export const FieldGrid = ({ children, cols = 2, className = "" }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-x-8 gap-y-6 ${className}`}>
        {children}
    </div>
);

export const ErrorBanner = ({ children }) =>
    children ? (
        <div className="mt-4 flex items-start gap-2 border border-[#d58874] bg-[#f6dfd5] text-[#7a2a18] px-3 py-2">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <p className="text-sm">{children}</p>
        </div>
    ) : null;

export const SuccessBanner = ({ children }) =>
    children ? (
        <div className="mt-4 flex items-start gap-2 border border-[#b9d3c1] bg-[#e6efe8] text-[#2f5c43] px-3 py-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5" />
            <p className="text-sm">{children}</p>
        </div>
    ) : null;

export const ReadonlyBlock = ({ title, items }) => (
    <div className="border border-ink-900/10 bg-cream-50 p-4">
        {title ? <div className="lw-eyebrow mb-3">{title}</div> : null}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((it) => (
                <div key={it.label}>
                    <dt className="lw-label">{it.label}</dt>
                    <dd className="font-mono text-sm text-ink-900">{it.value || <span className="text-slate-400">—</span>}</dd>
                </div>
            ))}
        </dl>
    </div>
);

export const FormActions = ({ children, align = "end" }) => (
    <div className={`mt-8 flex items-center gap-3 ${align === "between" ? "justify-between" : "justify-end"}`}>
        {children}
    </div>
);

export default PageShell;
