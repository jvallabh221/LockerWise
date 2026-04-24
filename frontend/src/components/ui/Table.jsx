import React from "react";
import { Inbox, Loader2 } from "lucide-react";

export const TableShell = ({ children, className = "" }) => (
    <div
        className={`overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-none ${className}`}
    >
        {children}
    </div>
);

export const TableToolbar = ({ children, className = "" }) => (
    <div
        className={`flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center ${className}`}
    >
        {children}
    </div>
);

export const TableContainer = ({ children, maxHeight = "60vh", minWidth = "min-w-[900px]", className = "" }) => (
    <div
        className={`no-scrollbar overflow-x-auto overflow-y-auto ${className}`}
        style={{ maxHeight }}
    >
        <div className={minWidth}>{children}</div>
    </div>
);

export const TableHeader = ({ columns = [], className = "" }) => (
    <thead className={`sticky top-0 z-10 bg-[var(--surface-2)] ${className}`}>
        <tr className="border-b border-[var(--border)]">
            {columns.map((h) => (
                <th
                    key={typeof h === "string" ? h : h.key}
                    scope="col"
                    className={`px-[18px] py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--text-3)] ${
                        typeof h === "object" && h.align === "right" ? "text-right" : ""
                    }`}
                    style={typeof h === "object" && h.width ? { width: h.width } : undefined}
                >
                    {typeof h === "string" ? h : h.label}
                </th>
            ))}
        </tr>
    </thead>
);

export const TableRow = ({ children, onClick, className = "", muted = false, selected = false }) => (
    <tr
        onClick={onClick}
        className={`border-b border-[var(--border)] transition-colors duration-1 ease-lw ${
            selected
                ? "bg-[var(--brand-100)] shadow-[inset_2px_0_0_var(--brand-500)]"
                : muted
                  ? "bg-[var(--surface-2)]/60"
                  : "hover:bg-[var(--bg)]"
        } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
        {children}
    </tr>
);

export const TableCell = ({
    children,
    className = "",
    align = "left",
    mono = false,
    lockerId = false,
    muted = false,
    truncate = null,
}) => {
    const alignCls = align === "right" ? "text-right" : align === "center" ? "text-center" : "";
    const truncateCls = truncate ? `truncate max-w-[${truncate}px]` : "";
    const monoCls = mono || lockerId;
    const textCls = lockerId
        ? "font-mono text-xs font-medium text-[var(--brand-700)] dark:text-brass-400"
        : monoCls
          ? "font-mono text-xs"
          : "";
    return (
        <td
            className={`px-[18px] py-2.5 text-[12.5px] leading-snug ${
                muted ? "text-[var(--text-3)]" : "text-[var(--text)]"
            } ${textCls} ${alignCls} ${truncateCls} ${className}`}
        >
            {children ?? <span className="text-[var(--text-3)]">—</span>}
        </td>
    );
};

export const TableEmpty = ({ colSpan = 1, title = "No results", description, icon: Icon = Inbox }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-14 text-center">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-3)]">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="font-display text-sm font-semibold text-[var(--text)]">{title}</div>
            {description ? (
                <p className="mx-auto mt-1 max-w-md text-sm text-[var(--text-2)]">{description}</p>
            ) : null}
        </td>
    </tr>
);

export const TableLoading = ({ colSpan = 1, label = "Loading…" }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-14 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-brass-400" />
                <p className="text-sm text-[var(--text-2)]">{label}</p>
            </div>
        </td>
    </tr>
);

export default TableShell;
