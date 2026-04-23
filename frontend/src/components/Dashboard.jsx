import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
    LockOpen
} from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();

    // ---------- MERGED AuthContext (was duplicated previously) ----------
    const { 
        loginDetails,
        loginSuccess,
        setLoginSuccess,
        updateSuccess,
        setUpdateSuccess
    } = useContext(AuthContext);

    // LockerContext
    const {
        allLockerDetails,
        allocatedLockerDetails,
        availableLockerDetails,
        expiredLockerDetails,
        maintenanceLockerDetails,
        expireIn7Days,
        expireIn1Day,
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

    // AdminContext
    const { 
        deleteSuccess, 
        setDeleteSuccess, 
        staffSuccess, 
        setStaffSuccess, 
        staffDeleteSuccess, 
        setStaffDeleteSuccess, 
        editStaffSuccess, 
        setEditStaffSuccess,
        staffs,
        lockerIssue,
        technicalIssue,
        lockerHistory,
    } = useContext(AdminContext);

    // ---------------- Toast effects (one useEffect per notification, preserving your original notifications) ----------------
    useEffect(() => {
        if (editStaffSuccess) {
            toast.success("User updated successfully");
            setEditStaffSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editStaffSuccess]);

    useEffect(() => {
        if (loginSuccess) {
            toast.success("Login successful. Welcome to the dashboard.");
            setLoginSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginSuccess]);

    useEffect(() => {
        if (staffSuccess) {
            toast.success("Staff Added Sucessfully...");
            setStaffSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffSuccess]);

    useEffect(() => {
        if (staffDeleteSuccess) {
            toast.success("Staff member removed successfully");
            setStaffDeleteSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffDeleteSuccess]);

    useEffect(() => {
        if (addMulSuccess) {
            toast.success("Lockers Created Successfully");
            setAddMulSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addMulSuccess]);

    useEffect(() => {
        if (assignSuccess) {
            toast.success("Locker allocated successfully");
            setAssignSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignSuccess]);

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Profile updated successfully.");
            setUpdateSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateSuccess]);

    useEffect(() => {
        if (cancelSuccess) {
            const message = cancelLockers?.message || "Locker taken back successfully";
            const lockerCode = cancelLockers?.data?.LockerCode;
            const notificationMessage = lockerCode 
                ? `${message}. Next combination is: ${lockerCode}`
                : message;
            toast.success(notificationMessage, {
                autoClose: 6000,
            });
            setCancelSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cancelSuccess, cancelLockers]);

    useEffect(() => {
        if (lockerSuccess) {
            toast.success("Locker issue raised  successfully");
            setLockerSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockerSuccess]);

    useEffect(() => {
        if (technicalSuccess) {
            toast.success("Technical issue reported successfully.");
            setTechnicalSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [technicalSuccess]);

    useEffect(() => {
        if (addSuccess) {
            toast.success("Locker Created Successfully");
            setAddSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addSuccess]);

    useEffect(() => {
        if (deleteSuccess) {
            toast.success("Locker deleted successfully.");
            setDeleteSuccess(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteSuccess]);

    // ---------------- Statistics ----------------
    const totalLockers = allLockerDetails?.length || 0;
    const availableLockers = availableLockerDetails?.length || 0;
    const inUseLockers = allocatedLockerDetails?.length || 0;
    const maintenanceLockers = maintenanceLockerDetails?.length || 0;

    // ---------------- Pie Chart Data (useMemo) ----------------
    const pieChartData = useMemo(() => {
        const total = totalLockers || 1;
        const otherCount = Math.max(0, total - availableLockers - inUseLockers - maintenanceLockers);
        
        const outerRadius = 100;
        const innerRadius = 60; // Inner radius for donut hole
        const centerX = 128;
        const centerY = 128;
        
        // Calculate percentages
        const availablePercent = (availableLockers / total) * 100;
        const inUsePercent = (inUseLockers / total) * 100;
        const maintenancePercent = (maintenanceLockers / total) * 100;
        const otherPercent = (otherCount / total) * 100;
        
        // Helper function to create donut slice path
        const createDonutSlice = (startAngle, endAngle) => {
            const startOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
            const endOuter = polarToCartesian(centerX, centerY, outerRadius, startAngle);
            const startInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);
            const endInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            
            return [
                `M ${startOuter.x} ${startOuter.y}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
                `L ${endInner.x} ${endInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
                'Z'
            ].join(' ');
        };
        
        // Convert polar coordinates to cartesian
        const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        };
        
        // Calculate angles (starting from top, going clockwise)
        let currentAngle = 0;
        
        const availableAngle = (availablePercent / 100) * 360;
        const inUseAngle = (inUsePercent / 100) * 360;
        const maintenanceAngle = (maintenancePercent / 100) * 360;
        const otherAngle = (otherPercent / 100) * 360;
        
        const availableStart = currentAngle;
        const availableEnd = currentAngle + availableAngle;
        currentAngle += availableAngle;
        
        const inUseStart = currentAngle;
        const inUseEnd = currentAngle + inUseAngle;
        currentAngle += inUseAngle;
        
        const maintenanceStart = currentAngle;
        const maintenanceEnd = currentAngle + maintenanceAngle;
        currentAngle += maintenanceAngle;
        
        const otherStart = currentAngle;
        const otherEnd = currentAngle + otherAngle;
    
        return {
            available: {
                percent: availablePercent,
                path: availablePercent > 0 ? createDonutSlice(availableStart, availableEnd) : '',
                startAngle: availableStart,
                endAngle: availableEnd
            },
            inUse: {
                percent: inUsePercent,
                path: inUsePercent > 0 ? createDonutSlice(inUseStart, inUseEnd) : '',
                startAngle: inUseStart,
                endAngle: inUseEnd
            },
            maintenance: {
                percent: maintenancePercent,
                path: maintenancePercent > 0 ? createDonutSlice(maintenanceStart, maintenanceEnd) : '',
                startAngle: maintenanceStart,
                endAngle: maintenanceEnd
            },
            other: {
                percent: otherPercent,
                count: otherCount,
                path: otherPercent > 0 ? createDonutSlice(otherStart, otherEnd) : '',
                startAngle: otherStart,
                endAngle: otherEnd
            },
            innerRadius
        };
    }, [availableLockers, inUseLockers, maintenanceLockers, totalLockers]);
    

    // ---------------- Recent Activity (useMemo) ----------------
    const recentActivity = useMemo(() => {
        if (!lockerHistory?.history) return [];

        const safeHistory = Array.isArray(lockerHistory.history) ? lockerHistory.history : [];

        const history = [...safeHistory]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(item => {
                const date = new Date(item.createdAt);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                let timeAgo = "";
                if (diffMins < 60) {
                    timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
                } else if (diffHours < 24) {
                    timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                } else if (diffDays === 1) {
                    timeAgo = "Yesterday";
                } else {
                    timeAgo = `${diffDays} days ago`;
                }

                // Determine icon and text based on comment/message
                let Icon = UserPlus;
                let iconColor = "text-purple-500";
                const comment = (item.comment || "").toString().toLowerCase();

                if (comment.includes("assigned") || comment.includes("allotted")) {
                    Icon = UserPlus;
                    iconColor = "text-purple-500";
                } else if (comment.includes("maintenance") || comment.includes("reported")) {
                    Icon = Wrench;
                    iconColor = "text-red-500";
                } else if (comment.includes("opened") || comment.includes("accessed")) {
                    Icon = LockOpen;
                    iconColor = "text-green-500";
                } else if (comment.includes("closed") || comment.includes("in use")) {
                    Icon = Lock;
                    iconColor = "text-yellow-500";
                }

                return {
                    ...item,
                    timeAgo,
                    icon: Icon,
                    iconColor
                };
            });

        return history;
    }, [lockerHistory]);

    // ---------------- Activity text formatter ----------------
    const formatActivityText = (item) => {
        const lockerNum = item.LockerNumber || "N/A";
        const holder = item.LockerHolder || "Unknown";
        const comment = (item.comment || "").toString();

        const low = comment.toLowerCase();
        if (low.includes("assigned") || low.includes("allotted")) {
            return `Locker ${lockerNum} assigned to ${holder}.`;
        } else if (low.includes("maintenance") || low.includes("reported")) {
            return `Locker ${lockerNum} reported for maintenance.`;
        } else if (low.includes("opened") || low.includes("accessed")) {
            return `Locker ${lockerNum} opened by ${holder}.`;
        } else if (low.includes("closed") || low.includes("in use")) {
            return `Locker ${lockerNum} is now in use.`;
        }

        return comment || `Locker ${lockerNum} - ${item.LockerStatus || "Updated"}`;
    };

    // ---------------- JSX ----------------
    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <section className="flex flex-col w-full px-4 py-8 gap-8 min-h-screen">
                {/* Header */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-purple-600 text-lg">
                        Welcome back, <span className="font-semibold text-gray-900">{loginDetails?.name || "User"}</span>! Here's an overview of your locker management system.
                    </p>
                </div>

                {/* Top Row - Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Lockers */}
                    <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-xl border border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Lockers</span>
                            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                                <KeyRound className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-gray-900">{totalLockers}</div>
                            <div className="text-sm text-gray-500 font-medium">lockers</div>
                        </div>
                    </div>

                    {/* Available */}
                    <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-xl border border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Available</span>
                            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-green-600">{availableLockers}</div>
                            <div className="text-sm text-gray-500 font-medium">available</div>
                        </div>
                    </div>

                    {/* In Use */}
                    <div className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-xl border border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide">In Use</span>
                            <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-orange-600">{inUseLockers}</div>
                            <div className="text-sm text-gray-500 font-medium">occupied</div>
                        </div>
                    </div>

                    {/* Needs Maintenance */}
                    <div className="group bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-xl border border-red-100 hover:border-red-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Maintenance</span>
                            <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-5xl font-bold text-red-600">{maintenanceLockers}</div>
                            <div className="text-sm text-gray-500 font-medium">needs repair</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Chart and Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Locker Status - Pie Chart */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Locker Status</h2>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-80 h-80 mb-8">
                                <svg className="w-80 h-80" viewBox="0 0 256 256">
                                    {/* Available - Green */}
                                    {pieChartData.available.path && (
                                        <path
                                            d={pieChartData.available.path}
                                            fill="#10b981"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    )}
                                    {/* In Use - Orange */}
                                    {pieChartData.inUse.path && (
                                        <path
                                            d={pieChartData.inUse.path}
                                            fill="#f97316"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    )}
                                    {/* Maintenance - Red */}
                                    {pieChartData.maintenance.path && (
                                        <path
                                            d={pieChartData.maintenance.path}
                                            fill="#ef4444"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    )}
                                    {/* Other - Gray */}
                                    {pieChartData.other.path && (
                                        <path
                                            d={pieChartData.other.path}
                                            fill="#6b7280"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    )}
                                    {/* White center circle */}
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r={pieChartData.innerRadius}
                                        fill="#ffffff"
                                        stroke="#e5e7eb"
                                        strokeWidth="1"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{totalLockers}</div>
                                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">Total Lockers</div>
                                </div>
                            </div>
                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                                    <div className="w-5 h-5 rounded-full bg-green-500 shadow-md"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-semibold text-sm">Available</span>
                                        <span className="text-xs text-gray-600">{availableLockers} ({pieChartData.available.percent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                                    <div className="w-5 h-5 rounded-full bg-orange-500 shadow-md"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-semibold text-sm">In Use</span>
                                        <span className="text-xs text-gray-600">{inUseLockers} ({pieChartData.inUse.percent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                                    <div className="w-5 h-5 rounded-full bg-red-500 shadow-md"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-semibold text-sm">Maintenance</span>
                                        <span className="text-xs text-gray-600">{maintenanceLockers} ({pieChartData.maintenance.percent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                {pieChartData.other.count > 0 && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-gray-500 shadow-md"></div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-semibold text-sm">Other</span>
                                            <span className="text-xs text-gray-600">{pieChartData.other.count} ({pieChartData.other.percent.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="space-y-3">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200 group">
                                            <div className={`${item.iconColor} p-3 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-900 text-sm font-medium leading-relaxed">
                                                    {formatActivityText(item)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                    <p className="text-gray-500 text-xs font-medium">{item.timeAgo}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <LockOpen className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No recent activity</p>
                                    <p className="text-gray-400 text-sm mt-1">Activity will appear here as it happens</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Dashboard;
