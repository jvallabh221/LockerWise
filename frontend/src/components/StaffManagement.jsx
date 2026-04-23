import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
import { UserPlus, Search, Pencil, Trash2 } from "lucide-react";
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
                    <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-tight">
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

                <div className="border border-ink-900/10 bg-white">
                    <div className="flex justify-end p-4 border-b border-ink-900/10">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-transparent border border-ink-900/20 text-sm focus:outline-none focus:border-brass-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto no-scrollbar">
                        <table className="w-full border-collapse min-w-[800px]">
                            <thead className="sticky top-0 bg-cream-50">
                                <tr className="border-b border-ink-900/15">
                                    {["Name", "Gender", "Email", "Phone", "Action"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-12 text-center">
                                            <div className="lw-eyebrow mb-2">No matches</div>
                                            <p className="text-slate-600 text-sm">No staff found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item, index) => (
                                        <tr key={index} className="border-b border-ink-900/10 hover:bg-cream-50/60 transition-colors">
                                            <td className="px-4 py-3 text-sm text-ink-900">{item.name || <Dash />}</td>
                                            <td className="px-4 py-3"><Badge tone="muted">{item.gender || "—"}</Badge></td>
                                            <td className="px-4 py-3 text-sm text-ink-900 truncate max-w-[220px]">{item.email || <Dash />}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-ink-900">{item.phoneNumber || <Dash />}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-ink-100 text-slate-600 bg-white text-xs font-medium rounded-md hover:bg-cream-200 hover:text-ink-900 hover:border-ink-200 transition-colors"
                                                    >
                                                        <Pencil className="w-3 h-3" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-error-500/30 text-error-600 bg-white text-xs font-medium rounded-md hover:bg-error-50 hover:border-error-500 transition-colors"
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
