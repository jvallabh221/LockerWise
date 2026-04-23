import React, { useState, useContext, useEffect } from "react";
import Layout from "./Layout";
import { LockerContext } from "../context/LockerProvider";
import { Badge } from "./ui/Badge";
import { Clock } from "lucide-react";

const LockerAnalysis = () => {
    const { expireIn7Days, expireIn1Day } = useContext(LockerContext);

    const lockers = expireIn7Days?.data || [];
    const smallLocker = expireIn1Day?.data || [];

    const [filterType, setFilterType] = useState("all");
    const [allLockers, setAllLockers] = useState([]);

    useEffect(() => {
        if (Array.isArray(lockers) && Array.isArray(smallLocker)) {
            const todayLockers = smallLocker.map((it) => ({ ...it, isToday: true }));
            const todayIds = smallLocker.map((it) => it._id);
            const sevenDaysLockers = lockers
                .filter((it) => !todayIds.includes(it._id))
                .map((it) => ({ ...it, isToday: false }));
            setAllLockers([...todayLockers, ...sevenDaysLockers]);
        } else {
            setAllLockers([]);
        }
    }, [lockers, smallLocker]);

    const filtered = allLockers.filter((item) => {
        if (filterType === "all") return true;
        if (filterType === "today") return item.isToday === true;
        if (filterType === "7days") return item.isToday === false;
        return true;
    });

    const toneForStatus = (s) => {
        if (s === "occupied") return "occupied";
        if (s === "available") return "available";
        if (s === "expired") return "expired";
        return "muted";
    };

    const todayCount = allLockers.filter((it) => it.isToday).length;
    const sevenCount = allLockers.length - todayCount;

    return (
        <Layout>
            <section className="w-full px-6 lg:px-10 py-10">
                <div className="lw-section-num mb-2">Analytics / Expiring</div>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl text-ink-900 font-semibold leading-tight tracking-tight">
                        Locker <span className="text-brass-500">analysis.</span>
                    </h1>
                    <div className="flex items-center gap-6 text-right">
                        <Stat label="Expiring today" value={todayCount} />
                        <Stat label="Next 7 days" value={sevenCount} />
                    </div>
                </div>
                <div className="lw-rule-brass w-16 mt-5 mb-8" />

                <div className="border border-ink-100 bg-white rounded-xl shadow-paper overflow-hidden">
                    <div className="flex justify-end p-4 border-b border-ink-100 gap-3 items-center">
                        <span className="lw-eyebrow">Window</span>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border border-ink-100 rounded-md px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20"
                        >
                            <option value="all">All</option>
                            <option value="today">Today</option>
                            <option value="7days">Next 7 days</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto no-scrollbar">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead className="sticky top-0 bg-cream-50">
                                <tr className="border-b border-ink-200">
                                    {["Locker", "Name", "Email", "Phone", "Gender", "Type", "Duration", "Expires", "Status"].map((h) => (
                                        <th key={h} className="px-3 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-14 text-center">
                                            <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-cream-200 text-slate-400">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div className="font-display text-sm font-semibold text-ink-900">No lockers in this window</div>
                                            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">Try a different time range.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item, index) => (
                                        <tr key={index} className="border-b border-ink-100 hover:bg-cream-50/60 transition-colors">
                                            <td className="px-3 py-3 font-mono text-sm text-ink-900">#{item.LockerNumber}</td>
                                            <td className="px-3 py-3 text-sm text-ink-900">{item.employeeName || <Dash />}</td>
                                            <td className="px-3 py-3 text-sm text-ink-900 truncate max-w-[200px]">{item.employeeEmail || <Dash />}</td>
                                            <td className="px-3 py-3 font-mono text-xs text-ink-900">{item.employeePhone || <Dash />}</td>
                                            <td className="px-3 py-3 text-sm text-ink-900">{item.availableForGender || <Dash />}</td>
                                            <td className="px-3 py-3 text-sm text-ink-900">{item.LockerType || <Dash />}</td>
                                            <td className="px-3 py-3 text-sm text-ink-900">{item.Duration || <Dash />}</td>
                                            <td className="px-3 py-3 font-mono text-xs text-ink-900">
                                                {item.expiresOn ? new Date(item.expiresOn).toISOString().split("T")[0] : <Dash />}
                                            </td>
                                            <td className="px-3 py-3">
                                                <Badge tone={toneForStatus(item.LockerStatus)}>{item.LockerStatus}</Badge>
                                            </td>
                                        </tr>
                                    ))
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

const Stat = ({ label, value }) => (
    <div>
        <div className="lw-eyebrow">{label}</div>
        <div className="font-display text-2xl text-ink-900 leading-none mt-1">{value}</div>
    </div>
);

export default LockerAnalysis;
