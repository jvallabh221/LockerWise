import React, { useContext, useState } from "react";
import DashNav from "./DashNav";
import Sidebar from "./Sidebar";
import { ShellMetaProvider } from "../context/ShellMetaContext";
import {
    User,
    Box,
    AlertTriangle,
    Settings,
    KeyRound,
    HistoryIcon,
    LayoutDashboard,
} from "lucide-react";
import { AuthContext } from "../context/AuthProvider";

const staffSections = [
    {
        label: "Workspace",
        items: [
            { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { title: "Locker Management", icon: KeyRound, path: "/locker_management" },
            { title: "Report Status", icon: Settings, path: "/view_report_status" },
        ],
    },
];

const adminSections = [
    {
        label: "Overview",
        items: [{ title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
    },
    {
        label: "Operations",
        items: [{ title: "Locker Management", icon: KeyRound, path: "/locker_management" }],
    },
    {
        label: "Administration",
        items: [
            { title: "Staff Management", icon: Box, path: "/staff_management" },
            { title: "Issue Management", icon: AlertTriangle, path: "/issue_management" },
        ],
    },
    {
        label: "Insights",
        items: [
            { title: "Locker History", icon: HistoryIcon, path: "/locker_history" },
            { title: "Locker Analysis", icon: User, path: "/locker_analysis" },
        ],
    },
];

const Layout = ({ children }) => {
    const { loginDetails } = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);

    const getMenuSections = () => {
        if (!loginDetails?.role) return [];
        const role = loginDetails.role.toLowerCase();
        if (role === "staff") return staffSections;
        if (role === "admin") return adminSections;
        return [];
    };

    const menuSections = getMenuSections();
    const showSidebar = loginDetails && menuSections.length > 0;

    return (
        <div className="flex min-h-screen flex-col lw-page">
            <ShellMetaProvider>
                <DashNav
                    variant={showSidebar ? "app" : "public"}
                    onMenuClick={showSidebar ? () => setMobileOpen(true) : undefined}
                />
                <div className="flex min-h-[calc(100vh-var(--topbar-h))] flex-1">
                    {showSidebar ? (
                        <Sidebar
                            sections={menuSections}
                            role={loginDetails.role}
                            loginDetails={loginDetails}
                            mobileOpen={mobileOpen}
                            onClose={() => setMobileOpen(false)}
                        />
                    ) : null}
                    <main
                        className={`min-w-0 flex-1 ${showSidebar ? "lg:ml-[72px] xl:ml-60" : ""}`}
                    >
                        {children}
                    </main>
                </div>
            </ShellMetaProvider>
        </div>
    );
};

export default Layout;
