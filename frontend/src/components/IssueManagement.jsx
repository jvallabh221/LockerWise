import React, { useState, useRef, useContext } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
import { Loader, ChevronDown, ChevronUp, CheckCircle2, ArrowRightCircle, Ban, Edit2, X, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from "date-fns";
import { Badge } from "./ui/Badge";

const toneForStatus = (s) => {
    if (s === "Unresolved") return "flag";
    if (s === "In Action") return "brass";
    if (s === "Resolved") return "available";
    return "muted";
};

const IssueManagement = () => {
    const [issueType, setIssueType] = useState("locker");
    const [loadingStates, setLoadingStates] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const { lockerIssue = [], technicalIssue = [], resolveIssue, updateIssue, updateComment } = useContext(AdminContext);

    const [editableStates, setEditableStates] = useState({});
    const [comments, setComments] = useState({});
    const commentRef = useRef(null);
    const [error, setError] = useState("");
    const [expandedRows, setExpandedRows] = useState(new Set());

    let filtered = issueType === "locker" ? lockerIssue : technicalIssue;
    filtered = (filtered || []).filter((item) => {
        const matchesEmail = !searchTerm || item.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !selectedDate || (() => {
            const date = new Date(item.createdAt);
            const f = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
            return f === selectedDate;
        })();
        return matchesEmail && matchesDate;
    });

    const handleEditClick = (id, item) => {
        setEditableStates((p) => ({ ...p, [id]: !p[id] }));
        if (!editableStates[id]) {
            setComments((p) => ({ ...p, [id]: item.comment || "" }));
            commentRef.current?.focus();
        }
    };

    const handleCommentSubmit = async (id) => {
        try {
            await updateComment(id, comments[id]);
        } catch {
            setError("Error updating comment");
        }
    };

    const setIssueLoading = (id, key, val) => {
        setLoadingStates((p) => ({ ...p, [id]: { ...p[id], [key]: val } }));
    };

    const handleResolve = async (id) => {
        setIssueLoading(id, "resolve", true);
        setError("");
        try { await resolveIssue(id); } catch { setError("Error resolving issue"); }
        finally { setIssueLoading(id, "resolve", false); }
    };

    const handleUpdate = async (id) => {
        setIssueLoading(id, "proceed", true);
        setError("");
        try { await updateIssue(id); } catch { setError("Error updating issue"); }
        finally { setIssueLoading(id, "proceed", false); }
    };

    const parseDate = (s) => (s ? parse(s, "dd-MM-yyyy", new Date()) : null);

    const toggleRow = (id) => {
        setExpandedRows((prev) => {
            const s = new Set(prev);
            if (s.has(id)) s.delete(id); else s.add(id);
            return s;
        });
    };

    return (
        <Layout>
            <section className="w-full px-6 lg:px-10 py-10">
                <div className="lw-section-num mb-2">Operations / Issues</div>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)] font-semibold leading-tight tracking-tight">
                        Issue <span className="text-brass-500">management.</span>
                    </h1>
                    <Link
                        to="/issue_reporting"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-medium text-sm rounded-md hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors"
                    >
                        Report an issue
                    </Link>
                </div>
                <div className="lw-rule-brass w-16 mt-5 mb-8" />

                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                    <div className="flex flex-col md:flex-row gap-3 justify-end p-4 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2">
                            <span className="lw-eyebrow">Type</span>
                            <select
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className="border border-[var(--border)] bg-[var(--surface)] rounded-md px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20"
                            >
                                <option value="locker">Locker</option>
                                <option value="technical">Technical</option>
                            </select>
                        </div>
                        <DatePicker
                            selected={parseDate(selectedDate)}
                            onChange={(d) => setSelectedDate(d ? format(d, "dd-MM-yyyy") : "")}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Date"
                            className="w-full md:w-44 px-3 py-2 border border-[var(--border)] bg-[var(--surface)] rounded-md text-sm text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                        />
                        <button
                            onClick={() => setSelectedDate("")}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] text-xs font-medium rounded-md hover:bg-[var(--surface-2)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Clear
                        </button>
                        <div className="relative flex-1 md:flex-initial md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[var(--border)] bg-[var(--surface)] rounded-md text-sm text-[var(--text)] focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto no-scrollbar">
                        <table className="w-full border-collapse min-w-[900px]">
                            <thead className="sticky top-0 bg-[var(--surface-2)]">
                                <tr className="border-b border-[var(--border-strong)]">
                                    {["Issue", "Email", "Subject", "Status", "Created", "Action"].map((h) => (
                                        <th key={h} className="px-3 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-14 text-center">
                                            <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-success-50 text-success-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div className="font-display text-sm font-semibold text-[var(--text)]">All clear</div>
                                            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">No issues match the current filters.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item, index) => {
                                        const isOpen = expandedRows.has(item._id);
                                        const created = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "—";
                                        return (
                                            <React.Fragment key={index}>
                                                <tr className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]/60 transition-colors">
                                                    <td className="px-3 py-3 font-mono text-sm text-[var(--text)]">
                                                        {item.type === "technical" ? "Technical" : `#${item.LockerNumber || "—"}`}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm text-[var(--text)] truncate max-w-[200px]">{item.email || "—"}</td>
                                                    <td className="px-3 py-3 text-sm text-[var(--text)] truncate max-w-[200px]">{item.subject || "—"}</td>
                                                    <td className="px-3 py-3">
                                                        <Badge tone={toneForStatus(item.status)}>{item.status || "—"}</Badge>
                                                    </td>
                                                    <td className="px-3 py-3 font-mono text-xs text-[var(--text)]">{created}</td>
                                                    <td className="px-3 py-3">
                                                        <button
                                                            onClick={() => toggleRow(item._id)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] text-xs font-medium rounded-md hover:bg-[var(--surface-2)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
                                                        >
                                                            {isOpen ? <><ChevronUp className="w-3 h-3" /> Hide</> : <><ChevronDown className="w-3 h-3" /> Detail</>}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isOpen && (
                                                    <tr className="bg-[var(--surface-2)]/60 border-b border-[var(--border)]">
                                                        <td colSpan="6" className="px-4 py-5">
                                                            <div className="space-y-5">
                                                                <div>
                                                                    <div className="lw-label">Description</div>
                                                                    <p className="text-sm text-[var(--text)]">{item.description || "—"}</p>
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="lw-label">Staff comment</div>
                                                                        <button
                                                                            onClick={() => handleEditClick(item._id, item)}
                                                                            className="text-slate-500 hover:text-[var(--text)]"
                                                                        >
                                                                            {editableStates[item._id] ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                                                        </button>
                                                                    </div>
                                                                    <textarea
                                                                        ref={commentRef}
                                                                        readOnly={!editableStates[item._id]}
                                                                        rows={3}
                                                                        className="lw-input resize-none"
                                                                        placeholder="Add a comment"
                                                                        value={comments[item._id] !== undefined ? comments[item._id] : item.comment || ""}
                                                                        onChange={(e) => setComments((p) => ({ ...p, [item._id]: e.target.value }))}
                                                                    />
                                                                    {editableStates[item._id] && (
                                                                        <div className="mt-3 flex justify-start">
                                                                            <button
                                                                                onClick={() => handleCommentSubmit(item._id)}
                                                                                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-medium text-sm rounded-md hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors"
                                                                            >
                                                                                Update comment
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {error && <p className="text-sm text-error-600">{error}</p>}
                                                                <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
                                                                    <button
                                                                        onClick={() => handleUpdate(item._id)}
                                                                        disabled={loadingStates[item._id]?.proceed || loadingStates[item._id]?.resolve || item.status === "In Action" || item.status === "Resolved"}
                                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-brass-400 hover:bg-brass-500 text-white text-sm font-medium rounded-md shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {loadingStates[item._id]?.proceed ? <Loader className="w-4 h-4 animate-spin" />
                                                                            : item.status === "In Action" || item.status === "Resolved" ? <Ban className="w-4 h-4" />
                                                                            : <ArrowRightCircle className="w-4 h-4" />}
                                                                        {loadingStates[item._id]?.proceed ? "Processing" : "Proceed"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleResolve(item._id)}
                                                                        disabled={loadingStates[item._id]?.proceed || loadingStates[item._id]?.resolve || item.status === "Resolved"}
                                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {loadingStates[item._id]?.resolve ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                                        {loadingStates[item._id]?.resolve ? "Saving" : "Resolved"}
                                                                    </button>
                                                                </div>
                                                            </div>
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

export default IssueManagement;
