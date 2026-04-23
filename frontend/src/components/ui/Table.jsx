import React from "react";
import { Inbox, Loader2 } from "lucide-react";

/**
 * LockerWise Table primitives — v2 (modern institutional SaaS)
 *
 * These are thin, composable wrappers around a native <table>. They give
 * every admin list the same visual language (header, row hover, dividers,
 * empty state, loading state) without forcing a single data shape.
 *
 * Usage:
 *
 *   <TableShell>
 *     <TableContainer>
 *       <table className="w-full border-collapse min-w-[900px]">
 *         <TableHeader columns={["Locker", "Email", ...]} />
 *         <tbody>
 *           {rows.length === 0
 *             ? <TableEmpty colSpan={8} title="No lockers" description="..." />
 *             : rows.map(r => <TableRow key={r.id}>... <TableCell/>... </TableRow>)}
 *         </tbody>
 *       </table>
 *     </TableContainer>
 *   </TableShell>
 */

export const TableShell = ({ children, className = "" }) => (
    <div className={`border border-ink-100 bg-white rounded-xl shadow-paper overflow-hidden ${className}`}>
        {children}
    </div>
);

export const TableToolbar = ({ children, className = "" }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-ink-100 ${className}`}>
        {children}
    </div>
);

export const TableContainer = ({ children, maxHeight = "60vh", minWidth = "min-w-[900px]", className = "" }) => (
    <div
        className={`overflow-x-auto overflow-y-auto no-scrollbar ${className}`}
        style={{ maxHeight }}
    >
        <div className={minWidth}>{children}</div>
    </div>
);

export const TableHeader = ({ columns = [], className = "" }) => (
    <thead className={`sticky top-0 z-10 bg-cream-50 ${className}`}>
        <tr className="border-b border-ink-200">
            {columns.map((h) => (
                <th
                    key={typeof h === "string" ? h : h.key}
                    className={`px-3 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500 ${
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

export const TableRow = ({ children, onClick, className = "", muted = false }) => (
    <tr
        onClick={onClick}
        className={`border-b border-ink-100 transition-colors ${
            muted ? "bg-cream-50/60" : "hover:bg-cream-50"
        } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className = "", align = "left", mono = false, muted = false, truncate = null }) => {
    const alignCls = align === "right" ? "text-right" : align === "center" ? "text-center" : "";
    const truncateCls = truncate ? `truncate max-w-[${truncate}px]` : "";
    return (
        <td
            className={`px-3 py-3 text-sm ${mono ? "font-mono text-xs" : ""} ${
                muted ? "text-slate-500" : "text-ink-900"
            } ${alignCls} ${truncateCls} ${className}`}
        >
            {children ?? <span className="text-slate-400">—</span>}
        </td>
    );
};

export const TableEmpty = ({ colSpan = 1, title = "No results", description, icon: Icon = Inbox }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-14 text-center">
            <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-cream-200 text-slate-400">
                <Icon className="w-4 h-4" />
            </div>
            <div className="font-display text-sm font-semibold text-ink-900">{title}</div>
            {description ? (
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">{description}</p>
            ) : null}
        </td>
    </tr>
);

export const TableLoading = ({ colSpan = 1, label = "Loading…" }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-14 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 text-brass-400 animate-spin" />
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </td>
    </tr>
);

export default TableShell;
