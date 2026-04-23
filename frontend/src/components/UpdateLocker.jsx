import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { LockerContext } from "../context/LockerProvider";
import { ChevronDown, ChevronUp, Search, RefreshCw, RotateCcw } from "lucide-react";
import { Badge } from "./ui/Badge";

const UpdateLocker = () => {
    const { expiredLockerDetails = [] } = useContext(LockerContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState(new Set());

    const filteredLockers = expiredLockerDetails.filter(
        (item) =>
            !searchTerm ||
            (item.employeeEmail && item.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.employeeName && item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.LockerNumber && item.LockerNumber.toString().includes(searchTerm))
    );

    const toggle = (n) => {
        setExpandedRows((prev) => {
            const s = new Set(prev);
            if (s.has(n)) s.delete(n);
            else s.add(n);
            return s;
        });
    };

    return (
        <Layout>
            <section className="w-full px-6 lg:px-10 py-10">
                <div className="lw-section-num mb-2">Operations / Expired</div>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-tight">
                        Update <span className="italic">expired lockers.</span>
                    </h1>
                    <div className="font-mono text-xs uppercase tracking-editorial text-slate-500">
                        {filteredLockers.length} shown
                    </div>
                </div>
                <div className="lw-rule-brass w-16 mt-5 mb-8" />

                <div className="border border-ink-900/10 bg-white">
                    <div className="flex justify-end p-4 border-b border-ink-900/10">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by email, name, or locker #"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-transparent border border-ink-900/20 text-sm focus:outline-none focus:border-brass-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-[60vh] no-scrollbar">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead className="sticky top-0 bg-cream-50">
                                <tr className="border-b border-ink-900/15">
                                    {["Locker", "Email", "Name", "Gender", "Type", "Phone", "Next code", "Expired", "Action"].map((h) => (
                                        <th key={h} className="px-3 py-3 text-left font-mono text-[0.7rem] uppercase tracking-editorial text-slate-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLockers.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-12 text-center">
                                            <div className="lw-eyebrow mb-2">No matches</div>
                                            <p className="text-slate-600 text-sm">No expired lockers found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLockers.map((item, index) => {
                                        const isOpen = expandedRows.has(item.LockerNumber);
                                        return (
                                            <React.Fragment key={index}>
                                                <tr className="border-b border-ink-900/10 hover:bg-cream-50/60 transition-colors">
                                                    <td className="px-3 py-3 font-mono text-sm text-ink-900">#{item.LockerNumber}</td>
                                                    <td className="px-3 py-3 text-sm text-ink-900 truncate max-w-[200px]">{item.employeeEmail || <Dash />}</td>
                                                    <td className="px-3 py-3 text-sm text-ink-900">{item.employeeName || <Dash />}</td>
                                                    <td className="px-3 py-3 text-sm text-ink-900">{item.availableForGender || <Dash />}</td>
                                                    <td className="px-3 py-3 text-sm text-ink-900">{item.LockerType || <Dash />}</td>
                                                    <td className="px-3 py-3 font-mono text-xs text-ink-900">{item.employeePhone || <Dash />}</td>
                                                    <td className="px-3 py-3 font-mono text-xs text-ink-900">{item.nextLockerCombination || <Dash />}</td>
                                                    <td className="px-3 py-3">
                                                        <Badge tone="expired">
                                                            {item.expiresOn ? new Date(item.expiresOn).toISOString().split("T")[0] : "—"}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <button
                                                            onClick={() => toggle(item.LockerNumber)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-ink-900/20 text-ink-900 font-mono text-[0.65rem] uppercase tracking-editorial hover:bg-ink-900 hover:text-cream-50 transition-colors"
                                                        >
                                                            {isOpen ? <><ChevronUp className="w-3 h-3" /> Hide</> : <><ChevronDown className="w-3 h-3" /> Detail</>}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isOpen && (
                                                    <tr className="bg-cream-50/60 border-b border-ink-900/10">
                                                        <td colSpan="9" className="px-4 py-5">
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                                <Detail label="Employee ID" value={item.employeeId} />
                                                                <Detail label="Duration" value={item.Duration} />
                                                                <Detail label="Created" value={item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : null} />
                                                            </div>
                                                            <div className="mt-5 flex gap-3">
                                                                <Link
                                                                    to="/update_locker_feature"
                                                                    state={{ LockerNumber: item.LockerNumber, employeeEmail: item.employeeEmail }}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-ink-900 text-ink-900 font-mono text-xs uppercase tracking-editorial hover:bg-ink-900 hover:text-cream-50 transition-colors"
                                                                >
                                                                    <RotateCcw className="w-4 h-4" />
                                                                    Reset
                                                                </Link>
                                                                <Link
                                                                    to="/renew_locker"
                                                                    state={{
                                                                        LockerNumber: item.LockerNumber,
                                                                        LockerPrice3Month: item.LockerPrice3Month,
                                                                        LockerPrice6Month: item.LockerPrice6Month,
                                                                        LockerPrice12Month: item.LockerPrice12Month,
                                                                        employeeEmail: item.employeeEmail,
                                                                        employeeName: item.employeeName,
                                                                    }}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors"
                                                                >
                                                                    <RefreshCw className="w-4 h-4" />
                                                                    Renew
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const Dash = () => <span className="text-slate-400">—</span>;

const Detail = ({ label, value }) => (
    <div>
        <div className="lw-label">{label}</div>
        <div className="font-mono text-sm text-ink-900">{value || <Dash />}</div>
    </div>
);

export default UpdateLocker;
