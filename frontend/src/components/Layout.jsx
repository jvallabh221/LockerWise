import React, { useContext } from "react";
import DashNav from "./DashNav";
import Sidebar from "./Sidebar";
import { User, Box, AlertTriangle, Settings, KeyRound, HistoryIcon, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";

const Layout = ({ children }) => {
    const { loginDetails } = useContext(AuthContext);

    const staff = [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { title: "Locker Management", icon: KeyRound, path: "/locker_management" },
        { title: "View Report Status", icon: Settings, path: "/view_report_status" },
    ];

    const admin = [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { title: "Locker Management", icon: KeyRound, path: "/locker_management" },
        { title: "Staff Management", icon: Box, path: "/staff_management" },
        { title: "Issue Reporting & Management", icon: AlertTriangle, path: "/issue_management" },
        { title: "Locker History", icon: HistoryIcon, path: "/locker_history" },
        { title: "Locker Analysis", icon: User, path: "/locker_analysis" },
    ];

    const getMenuItems = () => {
        if (!loginDetails?.role) return [];
        const role = loginDetails.role.toLowerCase();
        if (role === "staff") return staff;
        if (role === "admin") return admin;
        return [];
    };

    const menuItems = getMenuItems();

    return (
        <div className="min-h-screen flex flex-col lw-page lw-grain">
            <DashNav />
            <div className="flex flex-1 gap-8 pr-4 pb-8 h-[calc(100vh-80px)] overflow-hidden">
                {loginDetails && menuItems.length > 0 && (
                    <Sidebar items={menuItems} role={loginDetails.role} />
                )}
                <main className={`flex-1 overflow-y-auto ${loginDetails ? "ml-[64px]" : ""}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
