import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
import { UserPlus, Search, Pencil, Trash2, Users } from "lucide-react";
import Layout from "./Layout";
import { Badge } from "./ui/Badge";

const StaffManagement = () => {
    const { staffs = [], handleStaffDetails } = useContext(AdminContext);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        try {
            await handleStaffDetails(id);
            navigate("/view_staff_details");
        } catch {
            setError("Failed to open staff. Please try again.");
        }
    };

    const handleEdit = async (id) => {
        try {
            await handleStaffDetails(id);
            navigate("/edit_staff_details");
        } catch {
            setError("Failed to open staff. Please try again.");
        }
    };

    const filtered = staffs.filter((item) =>
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.phoneNumber && item.phoneNumber.includes(searchTerm))
    );

    return (
        <Layout>
            <section className="w-full px-6 lg:px-10 py-10">
                <div className="lw-section-num mb-2">Directory / Staff</div>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)] font-semibold leading-tight tracking-tight">
                        Staff <span className="text-brass-500">management.</span>
                    </h1>
                    <Link
                        to="/add_single_staff"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add staff
                    </Link>
                </div>
                <div className="lw-rule-brass w-16 mt-5 mb-8" />

                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                    <div className="flex justify-end p-4 border-b border-[var(--border)]">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[var(--border)] bg-[var(--surface)] rounded-md text-sm text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto no-scrollbar">
                        <table className="w-full border-collapse min-w-[800px]">
                            <thead className="sticky top-0 bg-[var(--surface-2)]">
                                <tr className="border-b border-[var(--border-strong)]">
                                    {["Name", "Gender", "Email", "Phone", "Action"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-14 text-center">
                                            <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text-3)]">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div className="font-display text-sm font-semibold text-[var(--text)]">
                                                {searchTerm ? "No matches" : "No staff yet"}
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                                                {searchTerm
                                                    ? "Try a different name, email, or phone number."
                                                    : "Add your first staff member to get started."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item, index) => (
                                        <tr key={index} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]/60 transition-colors">
                                            <td className="px-4 py-3 text-sm text-[var(--text)]">{item.name || <Dash />}</td>
                                            <td className="px-4 py-3"><Badge tone="muted">{item.gender || "—"}</Badge></td>
                                            <td className="px-4 py-3 text-sm text-[var(--text)] truncate max-w-[220px]">{item.email || <Dash />}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-[var(--text)]">{item.phoneNumber || <Dash />}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] text-xs font-medium rounded-md hover:bg-[var(--surface-2)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
                                                    >
                                                        <Pencil className="w-3 h-3" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-error-500/30 text-error-600 bg-[var(--surface)] text-xs font-medium rounded-md hover:bg-error-50 hover:border-error-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {error && (
                    <p className="mt-4 text-sm text-error-600">{error}</p>
                )}
            </section>
        </Layout>
    );
};

const Dash = () => <span className="text-slate-400">—</span>;

export default StaffManagement;
