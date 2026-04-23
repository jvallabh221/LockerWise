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
} from "lucide-react";

const StatBlock = ({ num, label, value, Icon, accent = "ink", suffix }) => {
    const accentMap = {
        ink: "bg-ink-900 text-cream-50",
        brass: "bg-brass-400 text-ink-900",
        green: "bg-[#e6efe8] text-[#2f5c43]",
        rust: "bg-[#f3d8cf] text-[#7a2a18]",
    };
    return (
        <div className="border border-ink-900/10 bg-white flex flex-col justify-between">
            <div className="flex items-start justify-between p-5 pb-3">
                <div>
                    <div className="lw-eyebrow mb-2">{num} / {label}</div>
                    <div className="font-display text-5xl text-ink-900 leading-none">{value}</div>
                    {suffix ? (
                        <div className="lw-eyebrow text-slate-500 mt-2">{suffix}</div>
                    ) : null}
                </div>
                <div className={`w-10 h-10 flex items-center justify-center ${accentMap[accent]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="h-1 bg-ink-900/5">
                <div
                    className={`h-1 ${accent === "brass" ? "bg-brass-400" : accent === "green" ? "bg-[#3e7b5a]" : accent === "rust" ? "bg-[#b5452c]" : "bg-ink-900"}`}
                    style={{ width: "100%" }}
                />
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { loginDetails, loginSuccess, setLoginSuccess, updateSuccess, setUpdateSuccess } = useContext(AuthContext);

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
        if (editStaffSuccess) { toast.success("User updated successfully"); setEditStaffSuccess(false); }
    }, [editStaffSuccess]);
    useEffect(() => {
        if (loginSuccess) { toast.success("Login successful. Welcome to the dashboard."); setLoginSuccess(false); }
    }, [loginSuccess]);
    useEffect(() => {
        if (staffSuccess) { toast.success("Staff added successfully."); setStaffSuccess(false); }
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
        if (updateSuccess) { toast.success("Profile updated successfully."); setUpdateSuccess(false); }
    }, [updateSuccess]);
    useEffect(() => {
        if (cancelSuccess) {
            const message = cancelLockers?.message || "Locker taken back successfully";
            const lockerCode = cancelLockers?.data?.LockerCode;
            toast.success(lockerCode ? `${message}. Next combination: ${lockerCode}` : message, { autoClose: 6000 });
            setCancelSuccess(false);
        }
    }, [cancelSuccess, cancelLockers]);
    useEffect(() => {
        if (lockerSuccess) { toast.success("Locker issue raised successfully."); setLockerSuccess(false); }
    }, [lockerSuccess]);
    useEffect(() => {
        if (technicalSuccess) { toast.success("Technical issue reported successfully."); setTechnicalSuccess(false); }
    }, [technicalSuccess]);
    useEffect(() => {
        if (addSuccess) { toast.success("Locker created successfully."); setAddSuccess(false); }
    }, [addSuccess]);
    useEffect(() => {
        if (deleteSuccess) { toast.success("Locker deleted."); setDeleteSuccess(false); }
    }, [deleteSuccess]);

    const totalLockers = allLockerDetails?.length || 0;
    const availableLockers = availableLockerDetails?.length || 0;
    const inUseLockers = allocatedLockerDetails?.length || 0;
    const maintenanceLockers = maintenanceLockerDetails?.length || 0;

    const pieChartData = useMemo(() => {
        const total = totalLockers || 1;
        const otherCount = Math.max(0, total - availableLockers - inUseLockers - maintenanceLockers);

        const outerRadius = 100;
        const innerRadius = 62;
        const centerX = 128;
        const centerY = 128;

        const availablePercent = (availableLockers / total) * 100;
        const inUsePercent = (inUseLockers / total) * 100;
        const maintenancePercent = (maintenanceLockers / total) * 100;
        const otherPercent = (otherCount / total) * 100;

        const polarToCartesian = (cx, cy, r, angle) => {
            const rad = (angle - 90) * Math.PI / 180;
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
        };
        const createDonutSlice = (startAngle, endAngle) => {
            const startOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
            const endOuter = polarToCartesian(centerX, centerY, outerRadius, startAngle);
            const startInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);
            const endInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            return [
                `M ${startOuter.x} ${startOuter.y}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
                `L ${endInner.x} ${endInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
                "Z",
            ].join(" ");
        };

        let currentAngle = 0;
        const availableAngle = (availablePercent / 100) * 360;
        const inUseAngle = (inUsePercent / 100) * 360;
        const maintenanceAngle = (maintenancePercent / 100) * 360;
        const otherAngle = (otherPercent / 100) * 360;

        const aS = currentAngle; const aE = currentAngle + availableAngle; currentAngle += availableAngle;
        const iS = currentAngle; const iE = currentAngle + inUseAngle; currentAngle += inUseAngle;
        const mS = currentAngle; const mE = currentAngle + maintenanceAngle; currentAngle += maintenanceAngle;
        const oS = currentAngle; const oE = currentAngle + otherAngle;

        return {
            available: { percent: availablePercent, path: availablePercent > 0 ? createDonutSlice(aS, aE) : "" },
            inUse: { percent: inUsePercent, path: inUsePercent > 0 ? createDonutSlice(iS, iE) : "" },
            maintenance: { percent: maintenancePercent, path: maintenancePercent > 0 ? createDonutSlice(mS, mE) : "" },
            other: { percent: otherPercent, count: otherCount, path: otherPercent > 0 ? createDonutSlice(oS, oE) : "" },
            innerRadius,
        };
    }, [availableLockers, inUseLockers, maintenanceLockers, totalLockers]);

    const recentActivity = useMemo(() => {
        if (!lockerHistory?.history) return [];
        const safe = Array.isArray(lockerHistory.history) ? lockerHistory.history : [];
        return [...safe]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
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

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={2000} theme="light" />
            <section className="flex flex-col w-full px-6 lg:px-10 py-10 gap-10">
                {/* Header */}
                <header className="flex flex-col gap-3">
                    <div className="lw-section-num">Dashboard / Overview</div>
                    <h1 className="font-display text-5xl text-ink-900 leading-[1.05]">
                        Good day, <span className="italic">{loginDetails?.name?.split(" ")[0] || "custodian"}.</span>
                    </h1>
                    <div className="lw-rule-brass w-16 mt-1" />
                    <p className="text-slate-600 max-w-2xl leading-relaxed">
                        The locker ledger at a glance. Counts are pulled live from the database; the legend below maps
                        status colors used across the product.
                    </p>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatBlock num="01" label="Total" value={totalLockers} Icon={KeyRound} accent="ink" suffix="In ledger" />
                    <StatBlock num="02" label="Available" value={availableLockers} Icon={CheckCircle} accent="green" suffix="Ready to assign" />
                    <StatBlock num="03" label="Occupied" value={inUseLockers} Icon={Users} accent="brass" suffix="In use" />
                    <StatBlock num="04" label="Maintenance" value={maintenanceLockers} Icon={AlertTriangle} accent="rust" suffix="Flagged" />
                </div>

                {/* Chart + Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut */}
                    <div className="border border-ink-900/10 bg-white p-8">
                        <div className="lw-eyebrow mb-1">05 / Composition</div>
                        <h2 className="font-display text-2xl text-ink-900 mb-6">Locker status</h2>
                        <div className="flex flex-col items-center">
                            <div className="relative w-80 h-80 mb-8">
                                <svg className="w-80 h-80" viewBox="0 0 256 256">
                                    {pieChartData.available.path && (
                                        <path d={pieChartData.available.path} fill="#3e7b5a" stroke="#fbf7ef" strokeWidth="2" />
                                    )}
                                    {pieChartData.inUse.path && (
                                        <path d={pieChartData.inUse.path} fill="#b8932c" stroke="#fbf7ef" strokeWidth="2" />
                                    )}
                                    {pieChartData.maintenance.path && (
                                        <path d={pieChartData.maintenance.path} fill="#b5452c" stroke="#fbf7ef" strokeWidth="2" />
                                    )}
                                    {pieChartData.other.path && (
                                        <path d={pieChartData.other.path} fill="#7c7c6f" stroke="#fbf7ef" strokeWidth="2" />
                                    )}
                                    <circle cx="128" cy="128" r={pieChartData.innerRadius} fill="#ffffff" stroke="#0b122014" strokeWidth="1" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="font-display text-5xl text-ink-900">{totalLockers}</div>
                                    <div className="lw-eyebrow text-slate-500 mt-1">Total lockers</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-md">
                                <LegendRow color="#3e7b5a" label="Available" count={availableLockers} percent={pieChartData.available.percent} />
                                <LegendRow color="#b8932c" label="Occupied" count={inUseLockers} percent={pieChartData.inUse.percent} />
                                <LegendRow color="#b5452c" label="Maintenance" count={maintenanceLockers} percent={pieChartData.maintenance.percent} />
                                {pieChartData.other.count > 0 && (
                                    <LegendRow color="#7c7c6f" label="Other" count={pieChartData.other.count} percent={pieChartData.other.percent} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="border border-ink-900/10 bg-white p-8">
                        <div className="lw-eyebrow mb-1">06 / Log</div>
                        <h2 className="font-display text-2xl text-ink-900 mb-6">Recent activity</h2>
                        <div className="divide-y divide-ink-900/10">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4 py-4">
                                            <div className="w-9 h-9 bg-cream-100 border border-ink-900/10 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4 text-ink-900" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-ink-900 text-sm leading-relaxed">
                                                    {formatActivityText(item)}
                                                </p>
                                                <p className="font-mono text-[0.7rem] uppercase tracking-editorial text-slate-500 mt-1">
                                                    {item.timeAgo}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-cream-100 border border-ink-900/10 mb-4">
                                        <LockOpen className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <p className="font-display text-xl text-ink-900">No recent activity</p>
                                    <p className="text-slate-500 text-sm mt-1">Assignments and reports will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const LegendRow = ({ color, label, count, percent }) => (
    <div className="flex items-center gap-3">
        <span className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="flex flex-col">
            <span className="text-sm text-ink-900">{label}</span>
            <span className="font-mono text-[0.7rem] uppercase tracking-editorial text-slate-500">
                {count} · {percent.toFixed(1)}%
            </span>
        </div>
    </div>
);

export default Dashboard;
