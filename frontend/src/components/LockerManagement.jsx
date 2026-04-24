import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { AuthContext } from "../context/AuthProvider";
import {
    Plus,
    Trash2,
    Pencil,
    ChevronDown,
    ChevronUp,
    UserPlus,
    Search,
    FileEdit,
    PackageOpen,
} from "lucide-react";
import Layout from "./Layout";
import { Badge } from "./ui/Badge";

const toneForStatus = (status) => {
    switch (status) {
        case "occupied": return "occupied";
        case "available": return "available";
        case "expired": return "expired";
        case "maintainance": return "maintenance";
        default: return "muted";
    }
};

const Action = ({ to, Icon, children, tone = "ink" }) => {
    const toneMap = {
        ink: "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]",
        brass: "bg-[var(--surface)] text-[var(--text)] border-brass-400 hover:bg-brass-400 hover:text-white",
        rust: "bg-[var(--surface)] text-error-600 border-error-500/30 hover:bg-error-50 hover:border-error-500",
        green: "bg-[var(--surface)] text-success-700 border-success-500/30 hover:bg-success-50 hover:border-success-500",
    };
    return (
        <Link
            to={to}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${toneMap[tone]}`}
        >
            <Icon className="w-4 h-4" />
            {children}
        </Link>
    );
};

const LockerManagement = () => {
    const {
        allLockerDetails = [],
        allocatedLockerDetails = [],
        availableLockerDetails = [],
        expiredLockerDetails = [],
        maintenanceLockerDetails = [],
        changeLockerStatus,
    } = useContext(LockerContext);
    const { loginDetails } = useContext(AuthContext);

    const [locker, setLocker] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState(new Set());

    let filteredLockers = allLockerDetails;
    if (locker === "expired") filteredLockers = expiredLockerDetails;
    else if (locker === "allocated") filteredLockers = allocatedLockerDetails;
    else if (locker === "available") filteredLockers = availableLockerDetails;
    else if (locker === "maintainance") filteredLockers = maintenanceLockerDetails;

    filteredLockers = filteredLockers.filter(
        (item) =>
            !searchTerm ||
            (item.employeeEmail && item.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.employeeId && item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleRowExpansion = (lockerNumber) => {
        setExpandedRows((prev) => {
            const s = new Set(prev);
            if (s.has(lockerNumber)) s.delete(lockerNumber);
            else s.add(lockerNumber);
            return s;
        });
    };

    return (
        <Layout>
            <section className="w-full px-6 lg:px-10 py-10">
                {/* Header */}
                <div className="flex flex-col gap-3 mb-8">
                    <div className="lw-section-num">Ledger / Lockers</div>
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)] font-semibold leading-tight tracking-tight">
                            Locker <span className="text-brass-500">management.</span>
                        </h1>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {filteredLockers.length} of {allLockerDetails.length} shown
                        </div>
                    </div>
                    <div className="lw-rule-brass w-16 mt-1" />
                </div>

                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                    {/* Toolbar — role actions */}
                    {loginDetails?.role === "Admin" && (
                        <div className="flex flex-wrap gap-3 p-4 border-b border-[var(--border)]">
                            <Action to="/add_single_locker" Icon={Plus} tone="ink">Add locker</Action>
                            <Action to="/add_multiple_locker" Icon={FileEdit} tone="ink">Bulk upload</Action>
                            <Action to="/delete_locker" Icon={Trash2} tone="rust">Delete locker</Action>
                            <Action to="/update_locker_price" Icon={Pencil} tone="brass">Update pricing</Action>
                        </div>
                    )}
                    {loginDetails?.role === "Staff" && (
                        <div className="flex flex-wrap gap-3 p-4 border-b border-[var(--border)]">
                            <Action to="/available_lockers" Icon={UserPlus} tone="ink">Assign locker</Action>
                            <Action to="/cancel_locker" Icon={Trash2} tone="rust">Cancel assignment</Action>
                            <Action to="/update_locker" Icon={Pencil} tone="brass">Update locker</Action>
                        </div>
                    )}

                    {/* Filter bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 p-4 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2">
                            <span className="lw-eyebrow">Filter</span>
                            <select
                                value={locker || ""}
                                onChange={(e) => setLocker(e.target.value || null)}
                                className="border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20"
                            >
                                <option value="">All</option>
                                <option value="expired">Expired</option>
                                <option value="available">Available</option>
                                <option value="allocated">Allocated</option>
                                <option value="maintainance">Maintenance</option>
                            </select>
                        </div>
                        <div className="relative flex-1 sm:flex-initial sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by email or employee ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[var(--border)] bg-[var(--surface)] rounded-md text-sm text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto overflow-y-auto max-h-[60vh] no-scrollbar">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead className="sticky top-0 z-10 bg-[var(--surface-2)]">
                                <tr className="border-b border-[var(--border-strong)]">
                                    {["Locker", "Email", "Name", "Emp ID", "Phone", "Status", "Expires", "Action"].map((h) => (
                                        <th key={h} className="px-3 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLockers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-14 text-center">
                                            <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text-3)]">
                                                <PackageOpen className="w-4 h-4" />
                                            </div>
                                            <div className="font-display text-sm font-semibold text-[var(--text)]">
                                                {searchTerm || locker ? "No matches" : "No lockers yet"}
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                                                {searchTerm || locker
                                                    ? "Try adjusting your search or filter."
                                                    : "Add lockers to start managing your inventory."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLockers.map((item, index) => {
                                        const isExpanded = expandedRows.has(item.LockerNumber);
                                        return (
                                            <React.Fragment key={index}>
                                                <tr className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]/60 transition-colors">
                                                    <td className="px-3 py-3 font-mono text-sm text-[var(--text)]">
                                                        #{item.LockerNumber}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm text-[var(--text)] truncate max-w-[180px]">
                                                        {item.employeeEmail || <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm text-[var(--text)] truncate max-w-[140px]">
                                                        {item.employeeName || <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="px-3 py-3 font-mono text-xs text-[var(--text)]">
                                                        {item.employeeId || <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="px-3 py-3 font-mono text-xs text-[var(--text)]">
                                                        {item.employeePhone || <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        {(item.LockerStatus === "occupied" || item.LockerStatus === "expired") ? (
                                                            <Badge tone={toneForStatus(item.LockerStatus)}>
                                                                {item.LockerStatus}
                                                            </Badge>
                                                        ) : (
                                                            <select
                                                                value={item.LockerStatus || ""}
                                                                onChange={(e) => changeLockerStatus(item.LockerNumber, e.target.value)}
                                                                className="border border-[var(--border)] bg-[var(--surface)] rounded-md px-2 py-1 text-xs text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20"
                                                            >
                                                                <option value="available">Available</option>
                                                                <option value="maintainance">Maintenance</option>
                                                            </select>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-3 font-mono text-xs text-[var(--text)]">
                                                        {item.expiresOn
                                                            ? new Date(item.expiresOn).toISOString().split("T")[0]
                                                            : <span className="text-slate-400">—</span>}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <button
                                                            onClick={() => toggleRowExpansion(item.LockerNumber)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] text-xs font-medium rounded-md hover:bg-[var(--surface-2)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    <ChevronUp className="w-3 h-3" />
                                                                    <span>Hide</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronDown className="w-3 h-3" />
                                                                    <span>Detail</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-[var(--surface-2)]/60 border-b border-[var(--border)]">
                                                        <td colSpan="8" className="px-4 py-5">
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                                <Detail label="Gender" value={item.availableForGender} />
                                                                <Detail label="Type" value={item.LockerType} />
                                                                <Detail label="Duration" value={item.Duration} />
                                                                <Detail
                                                                    label="Created"
                                                                    value={item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : null}
                                                                />
                                                            </div>
                                                            {item.LockerStatus === "occupied" && (
                                                                <div className="mt-5">
                                                                    <Link
                                                                        to="/editLockerDetails"
                                                                        state={item}
                                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-medium text-sm rounded-md hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors"
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                        Edit locker
                                                                    </Link>
                                                                </div>
                                                            )}
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

const Detail = ({ label, value }) => (
    <div>
        <div className="lw-label">{label}</div>
        <div className="font-mono text-sm text-[var(--text)]">{value || <span className="text-slate-400">—</span>}</div>
    </div>
);

export default LockerManagement;
