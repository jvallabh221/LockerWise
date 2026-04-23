import React, { useContext } from "react";
import DashNav from "./DashNav";
import Sidebar from "./Sidebar";
import { User, Box, RefreshCw, AlertTriangle, Settings, KeyRound, HistoryIcon, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";

const Layout = ({ children }) => {
    const { loginDetails } = useContext(AuthContext);

    const staff = [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Overview and statistics", stats: "Home" },
        { title: "Locker Management", icon: KeyRound, path: "/locker_management", description: "View and manage all lockers", stats: "450 Lockers" },
        // { title: "Assign Locker", icon: User, path: "/available_lockers", description: "Assign lockers to the users", stats: "2.4k Users" },
        // { title: "Cancel Locker Assignment", icon: Box, path: "/cancel_locker", description: "Oversee staff and their roles", stats: "156 Staff" },
        // { title: "Update Locker", icon: RefreshCw, path: "/update_locker", description: "Review all transactions", stats: "1.2k/month" },
        // { title: "Issue Reporting", icon: AlertTriangle, path: "/issue_reporting", description: "Report issues with lockers or staff", stats: "5 Active" },
        { title: "View Report Status", icon: Settings, path: "/view_report_status", description: "Check the status of reported issues", stats: "Updated" },
    ];

    const admin = [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Overview and statistics", stats: "Home" },
        { title: "Locker Management", icon: KeyRound, path: "/locker_management", description: "View and manage all lockers", stats: "450 Lockers" },
        { title: "Staff Management", icon: Box, path: "/staff_management", description: "Oversee staff and their roles", stats: "156 Staff" },
        { title: "Issue Reporting & Management", icon: AlertTriangle, path: "/issue_management", description: "View issues with lockers or staff", stats: "5 Active" },
        { title: "Locker History", icon: HistoryIcon, path: "/locker_history", description: "View the history of the lockers", stats: "2.4k Users" },
        { title: "Locker Analysis", icon: User, path: "/locker_analysis", description: "Analysing the lockers", stats: "2.4k Users" },
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-50">
            <DashNav />
            <div className="flex flex-1 gap-8 pr-4 pb-8 h-[calc(100vh-80px)] overflow-hidden">
                {loginDetails && menuItems.length > 0 && <Sidebar items={menuItems} role={loginDetails.role} />}
                <main className={`flex-1 overflow-y-auto ${loginDetails ? 'ml-[64px]' : ''}`}>{children}</main>
            </div>
        </div>
    );
};

export default Layout;
