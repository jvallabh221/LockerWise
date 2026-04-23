import React, { useContext, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthProvider";
import { LockerContext } from "../context/LockerProvider";
import { AdminContext } from "../context/AdminProvider";
import Layout from "./Layout";
import {
    KeyRound,
    CheckCircle,
    Users,
    AlertTriangle,
    UserPlus,
    Wrench,
    Lock,
    LockOpen,
    TrendingUp,
    Activity,
} from "lucide-react";

/* ------------------------------- Tokens -------------------------------- */

const CHART_COLORS = {
    available:   "#10B981", // success
    occupied:    "#F59E0B", // warning
    maintenance: "#EF4444", // error
    other:       "#4D5D80", // slate
    ring:        "#F9FAFC", // card bg
};

/* ------------------------------- StatCard ------------------------------ */

const StatCard = ({ label, value, Icon, tone = "accent", hint, delta }) => {
    const toneMap = {
        accent:  { bg: "bg-brass-50",   text: "text-brass-500",   dot: "bg-brass-400"   },
        navy:    { bg: "bg-ink-50",     text: "text-ink-700",     dot: "bg-ink-900"     },
        success: { bg: "bg-success-50", text: "text-success-600", dot: "bg-success-500" },
        warning: { bg: "bg-warning-50", text: "text-warning-600", dot: "bg-warning-500" },
        error:   { bg: "bg-error-50",   text: "text-error-600",   dot: "bg-error-500"   },
    };
    const t = toneMap[tone] || toneMap.accent;

    return (
        <div className="bg-white border border-ink-100 rounded-xl p-5 shadow-paper">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
                    <div className="mt-2 font-display text-3xl text-ink-900 font-semibold leading-none">{value}</div>
                    {hint ? <div className="mt-1.5 text-xs text-slate-400">{hint}</div> : null}
                </div>
                <div className={`w-10 h-10 rounded-lg ${t.bg} ${t.text} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {delta != null ? (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-success-600">
                    <TrendingUp className="w-3.5 h-3.5" /> {delta}
                </div>
            ) : null}
        </div>
    );
};

/* ------------------------------- Dashboard ----------------------------- */

const Dashboard = () => {
    const { loginDetails, loginSuccess, setLoginSuccess, updateSuccess, setUpdateSuccess } =
        useContext(AuthContext);

    const {
        allLockerDetails,
        allocatedLockerDetails,
        availableLockerDetails,
        maintenanceLockerDetails,
        assignSuccess,
        setAssignSuccess,
        cancelSuccess,
        setCancelSuccess,
        technicalSuccess,
        setTechnicalSuccess,
        lockerSuccess,
        setLockerSuccess,
        addSuccess,
        setAddSuccess,
        addMulSuccess,
        setAddMulSuccess,
        cancelLockers,
    } = useContext(LockerContext);

    const {
        deleteSuccess,
        setDeleteSuccess,
        staffSuccess,
        setStaffSuccess,
        staffDeleteSuccess,
        setStaffDeleteSuccess,
        editStaffSuccess,
        setEditStaffSuccess,
        lockerHistory,
    } = useContext(AdminContext);

    useEffect(() => {
        if (editStaffSuccess) { toast.success("Staff profile updated."); setEditStaffSuccess(false); }
    }, [editStaffSuccess]);
    useEffect(() => {
        if (loginSuccess) { toast.success("Signed in successfully."); setLoginSuccess(false); }
    }, [loginSuccess]);
    useEffect(() => {
        if (staffSuccess) { toast.success("Staff member added."); setStaffSuccess(false); }
    }, [staffSuccess]);
    useEffect(() => {
        if (staffDeleteSuccess) { toast.success("Staff member removed."); setStaffDeleteSuccess(false); }
    }, [staffDeleteSuccess]);
    useEffect(() => {
        if (addMulSuccess) { toast.success("Lockers created successfully."); setAddMulSuccess(false); }
    }, [addMulSuccess]);
    useEffect(() => {
        if (assignSuccess) { toast.success("Locker allocated successfully."); setAssignSuccess(false); }
    }, [assignSuccess]);
    useEffect(() => {
        if (updateSuccess) { toast.success("Profile updated."); setUpdateSuccess(false); }
    }, [updateSuccess]);
    useEffect(() => {
        if (cancelSuccess) {
            const message = cancelLockers?.message || "Locker returned successfully.";
            const lockerCode = cancelLockers?.data?.LockerCode;
            toast.success(lockerCode ? `${message} Next combination: ${lockerCode}` : message, { autoClose: 6000 });
            setCancelSuccess(false);
        }
    }, [cancelSuccess, cancelLockers]);
    useEffect(() => {
        if (lockerSuccess) { toast.success("Locker issue raised."); setLockerSuccess(false); }
    }, [lockerSuccess]);
    useEffect(() => {
        if (technicalSuccess) { toast.success("Technical issue reported."); setTechnicalSuccess(false); }
    }, [technicalSuccess]);
    useEffect(() => {
        if (addSuccess) { toast.success("Locker created."); setAddSuccess(false); }
    }, [addSuccess]);
    useEffect(() => {
        if (deleteSuccess) { toast.success("Locker deleted."); setDeleteSuccess(false); }
    }, [deleteSuccess]);

    const totalLockers       = allLockerDetails?.length || 0;
    const availableLockers   = availableLockerDetails?.length || 0;
    const inUseLockers       = allocatedLockerDetails?.length || 0;
    const maintenanceLockers = maintenanceLockerDetails?.length || 0;

    const pieChartData = useMemo(() => {
        const total = totalLockers || 1;
        const otherCount = Math.max(0, total - availableLockers - inUseLockers - maintenanceLockers);

        const outerRadius = 100;
        const innerRadius = 68;
        const cx = 128;
        const cy = 128;

        const availablePercent   = (availableLockers / total) * 100;
        const inUsePercent       = (inUseLockers / total) * 100;
        const maintenancePercent = (maintenanceLockers / total) * 100;
        const otherPercent       = (otherCount / total) * 100;

        const polar = (r, angle) => {
            const rad = (angle - 90) * Math.PI / 180;
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
        };
        const slice = (startAngle, endAngle) => {
            const so = polar(outerRadius, endAngle);
            const eo = polar(outerRadius, startAngle);
            const si = polar(innerRadius, endAngle);
            const ei = polar(innerRadius, startAngle);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            return `M ${so.x} ${so.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${eo.x} ${eo.y} L ${ei.x} ${ei.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${si.x} ${si.y} Z`;
        };

        let a = 0;
        const aA = (availablePercent / 100) * 360;
        const iA = (inUsePercent / 100) * 360;
        const mA = (maintenancePercent / 100) * 360;
        const oA = (otherPercent / 100) * 360;

        const aS = a; const aE = a + aA; a += aA;
        const iS = a; const iE = a + iA; a += iA;
        const mS = a; const mE = a + mA; a += mA;
        const oS = a; const oE = a + oA;

        return {
            available:   { percent: availablePercent,   path: availablePercent   > 0 ? slice(aS, aE) : "" },
            inUse:       { percent: inUsePercent,       path: inUsePercent       > 0 ? slice(iS, iE) : "" },
            maintenance: { percent: maintenancePercent, path: maintenancePercent > 0 ? slice(mS, mE) : "" },
            other:       { percent: otherPercent, count: otherCount, path: otherPercent > 0 ? slice(oS, oE) : "" },
            innerRadius,
        };
    }, [availableLockers, inUseLockers, maintenanceLockers, totalLockers]);

    const recentActivity = useMemo(() => {
        if (!lockerHistory?.history) return [];
        const safe = Array.isArray(lockerHistory.history) ? lockerHistory.history : [];
        return [...safe]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6)
            .map((item) => {
                const date = new Date(item.createdAt);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);
                let timeAgo = "";
                if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                else if (diffDays === 1) timeAgo = "yesterday";
                else timeAgo = `${diffDays}d ago`;

                let Icon = UserPlus;
                const comment = (item.comment || "").toString().toLowerCase();
                if (comment.includes("assigned") || comment.includes("allotted")) Icon = UserPlus;
                else if (comment.includes("maintenance") || comment.includes("reported")) Icon = Wrench;
                else if (comment.includes("opened") || comment.includes("accessed")) Icon = LockOpen;
                else if (comment.includes("closed") || comment.includes("in use")) Icon = Lock;

                return { ...item, timeAgo, icon: Icon };
            });
    }, [lockerHistory]);

    const formatActivityText = (item) => {
        const lockerNum = item.LockerNumber || "N/A";
        const holder = item.LockerHolder || "Unknown";
        const comment = (item.comment || "").toString();
        const low = comment.toLowerCase();
        if (low.includes("assigned") || low.includes("allotted")) return `Locker ${lockerNum} assigned to ${holder}.`;
        if (low.includes("maintenance") || low.includes("reported")) return `Locker ${lockerNum} reported for maintenance.`;
        if (low.includes("opened") || low.includes("accessed")) return `Locker ${lockerNum} opened by ${holder}.`;
        if (low.includes("closed") || low.includes("in use")) return `Locker ${lockerNum} is now in use.`;
        return comment || `Locker ${lockerNum} — ${item.LockerStatus || "Updated"}`;
    };

    const firstName = loginDetails?.name?.split(" ")[0] || "there";

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={2500} theme="light" />
            <section className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-10 space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <div className="lw-eyebrow mb-2">Overview</div>
                        <h1 className="font-display text-3xl lg:text-[2rem] text-ink-900 font-semibold leading-tight">
                            Good day, <span className="text-brass-500">{firstName}.</span>
                        </h1>
                        <p className="mt-2 text-slate-500 max-w-2xl leading-relaxed text-[0.95rem]">
                            A live view of your locker inventory. Counts below update as assignments change across
                            the organization.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Activity className="w-3.5 h-3.5" />
                        Live ledger
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard label="Total lockers"     value={totalLockers}       Icon={KeyRound}       tone="navy"    hint="In ledger" />
                    <StatCard label="Available"         value={availableLockers}   Icon={CheckCircle}    tone="success" hint="Ready to assign" />
                    <StatCard label="Occupied"          value={inUseLockers}       Icon={Users}          tone="warning" hint="Currently in use" />
                    <StatCard label="Maintenance"       value={maintenanceLockers} Icon={AlertTriangle}  tone="error"   hint="Flagged for review" />
                </div>

                {/* Chart + Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Donut */}
                    <div className="lg:col-span-2 bg-white border border-ink-100 rounded-xl shadow-paper p-6">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="lw-eyebrow mb-1">Composition</div>
                                <h2 className="font-display text-lg font-semibold text-ink-900">Locker status</h2>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-4">
                            <div className="relative w-64 h-64 mb-6">
                                <svg className="w-64 h-64" viewBox="0 0 256 256">
                                    {pieChartData.available.path && (
                                        <path d={pieChartData.available.path}   fill={CHART_COLORS.available}   stroke={CHART_COLORS.ring} strokeWidth="2" />
                                    )}
                                    {pieChartData.inUse.path && (
                                        <path d={pieChartData.inUse.path}       fill={CHART_COLORS.occupied}    stroke={CHART_COLORS.ring} strokeWidth="2" />
                                    )}
                                    {pieChartData.maintenance.path && (
                                        <path d={pieChartData.maintenance.path} fill={CHART_COLORS.maintenance} stroke={CHART_COLORS.ring} strokeWidth="2" />
                                    )}
                                    {pieChartData.other.path && (
                                        <path d={pieChartData.other.path}       fill={CHART_COLORS.other}       stroke={CHART_COLORS.ring} strokeWidth="2" />
                                    )}
                                    <circle cx="128" cy="128" r={pieChartData.innerRadius} fill="#FFFFFF" stroke="#DDE3F0" strokeWidth="1" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="font-display text-4xl text-ink-900 font-semibold">{totalLockers}</div>
                                    <div className="text-xs text-slate-500 mt-1">Total lockers</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full max-w-sm">
                                <LegendRow color={CHART_COLORS.available}   label="Available"   count={availableLockers}   percent={pieChartData.available.percent} />
                                <LegendRow color={CHART_COLORS.occupied}    label="Occupied"    count={inUseLockers}       percent={pieChartData.inUse.percent} />
                                <LegendRow color={CHART_COLORS.maintenance} label="Maintenance" count={maintenanceLockers} percent={pieChartData.maintenance.percent} />
                                {pieChartData.other.count > 0 && (
                                    <LegendRow color={CHART_COLORS.other} label="Other" count={pieChartData.other.count} percent={pieChartData.other.percent} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="lg:col-span-3 bg-white border border-ink-100 rounded-xl shadow-paper p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="lw-eyebrow mb-1">Activity</div>
                                <h2 className="font-display text-lg font-semibold text-ink-900">Recent activity</h2>
                            </div>
                        </div>
                        {recentActivity.length > 0 ? (
                            <div className="divide-y divide-ink-100">
                                {recentActivity.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                                            <div className="w-9 h-9 bg-brass-50 text-brass-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-ink-900 text-sm leading-relaxed">
                                                    {formatActivityText(item)}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">{item.timeAgo}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-cream-200 rounded-full mb-3 text-slate-400">
                                    <LockOpen className="w-5 h-5" />
                                </div>
                                <p className="font-display text-base font-semibold text-ink-900">No recent activity</p>
                                <p className="text-slate-500 text-sm mt-1">Assignments and reports will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const LegendRow = ({ color, label, count, percent }) => (
    <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="flex flex-col min-w-0">
            <span className="text-sm text-ink-900 font-medium truncate">{label}</span>
            <span className="text-xs text-slate-400">
                {count} · {percent.toFixed(1)}%
            </span>
        </div>
    </div>
);

export default Dashboard;
