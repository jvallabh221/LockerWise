import React, { useContext, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeProvider";
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
    Activity,
} from "lucide-react";
import { StatCard } from "./ui/StatCard";

/* ------------------------------- Tokens -------------------------------- */

// Occupied slice uses sky (§7.4) — info / brand-500
const CHART_COLORS = {
    available:   "var(--success)",
    occupied:    "var(--brand-500)",
    maintenance: "var(--error)",
    other:       "var(--text-3)",
    ring:        "var(--surface-2)",
};

/* ------------------------------- Dashboard ----------------------------- */

const Dashboard = () => {
    const { effective } = useTheme();
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
            <ToastContainer position="top-right" autoClose={2500} theme={effective === "dark" ? "dark" : "light"} />
            <section className="mx-auto w-full max-w-[1600px] space-y-5 px-6 py-8 lg:px-6 lg:py-10">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="lw-eyebrow mb-2">Overview</div>
                        <h1 className="font-display text-3xl font-semibold leading-tight text-[var(--text)] lg:text-[2rem]">
                            Good day, <span className="text-brass-500">{firstName}.</span>
                        </h1>
                        <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--text-2)]">
                            A live view of your locker inventory. Counts below update as assignments change across
                            the organization.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                        <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Live ledger
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                    <StatCard label="Total lockers" value={String(totalLockers)} Icon={KeyRound} hint="In ledger" />
                    <StatCard label="Available" value={String(availableLockers)} Icon={CheckCircle} hint="Ready to assign" />
                    <StatCard label="Occupied" value={String(inUseLockers)} Icon={Users} hint="Currently in use" />
                    <StatCard label="Maintenance" value={String(maintenanceLockers)} Icon={AlertTriangle} hint="Flagged for review" />
                </div>

                {/* Chart + Activity */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-6">
                    {/* Donut */}
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-none lg:col-span-2">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <div className="lw-eyebrow mb-1">Composition</div>
                                <h2 className="font-display text-lg font-semibold text-[var(--text)]">Locker status</h2>
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
                                    <circle cx="128" cy="128" r={pieChartData.innerRadius} fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
                                </svg>
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="font-display text-4xl font-semibold text-[var(--text)]">{totalLockers}</div>
                                    <div className="mt-1 text-xs text-[var(--text-2)]">Total lockers</div>
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
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-none lg:col-span-3">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <div className="lw-eyebrow mb-1">Activity</div>
                                <h2 className="font-display text-lg font-semibold text-[var(--text)]">Recent activity</h2>
                            </div>
                        </div>
                        {recentActivity.length > 0 ? (
                            <div className="divide-y divide-[var(--border)]">
                                {recentActivity.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brass-50 text-brass-500 dark:bg-[var(--surface-2)]">
                                                <Icon className="h-4 w-4" strokeWidth={1.75} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm leading-relaxed text-[var(--text)]">
                                                    {formatActivityText(item)}
                                                </p>
                                                <p className="mt-0.5 text-xs text-[var(--text-3)]">{item.timeAgo}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-3)]">
                                    <LockOpen className="h-5 w-5" strokeWidth={1.75} />
                                </div>
                                <p className="font-display text-base font-semibold text-[var(--text)]">No recent activity</p>
                                <p className="mt-1 text-sm text-[var(--text-2)]">Assignments and reports will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const LegendRow = ({ color, label, count, percent }) => (
    <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-[var(--text)]">{label}</span>
            <span className="text-xs text-[var(--text-3)]">
                {count} · {percent.toFixed(1)}%
            </span>
        </div>
    </div>
);

export default Dashboard;
