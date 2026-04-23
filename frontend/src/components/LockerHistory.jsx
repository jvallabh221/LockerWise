import React, { useState, useContext, useRef, useEffect } from "react";
import { AdminContext } from "../context/AdminProvider";
import ReactPaginate from "react-paginate";
import Layout from "./Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight, Search, Calendar, Loader, Trash2, X, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from "date-fns";

const LockerHistory = () => {
    const { lockerHistory, clearHistory, getLockerHistory } = useContext(AdminContext);
    const [searchLocker, setSearchLocker] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [clearStart, setClearStart] = useState("");
    const [clearEnd, setClearEnd] = useState("");
    const [showClearSection, setShowClearSection] = useState(false);
    const [clearSuccess, setClearSuccess] = useState(false);
    const clearRef = useRef(null);

    const isLoading = lockerHistory === null;
    let history = lockerHistory?.history || [];

    history = history.filter((it) => !searchLocker || String(it.LockerNumber).includes(searchLocker.toString()));

    const fdate = (d) => {
        const date = new Date(d);
        return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    };

    if (startDate && endDate) {
        history = history.filter((it) => {
            const d = fdate(it.createdAt);
            return d >= startDate && d <= endDate;
        });
    } else if (startDate) {
        history = history.filter((it) => fdate(it.createdAt) >= startDate);
    } else if (endDate) {
        history = history.filter((it) => fdate(it.createdAt) <= endDate);
    }

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const pageCount = Math.ceil(history.length / itemsPerPage);
    const currentItems = history.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const startRange = currentPage * itemsPerPage + 1;
    const endRange = Math.min((currentPage + 1) * itemsPerPage, history.length);

    useEffect(() => {
        if (clearSuccess) {
            toast.success("History cleared.");
            setClearSuccess(false);
            if (getLockerHistory) getLockerHistory();
        }
    }, [clearSuccess, getLockerHistory]);

    const parseDate = (s) => (s ? parse(s, "dd-MM-yyyy", new Date()) : null);
    const parseDate1 = (s) => (s ? parse(s, "yyyy-MM-dd", new Date()) : null);

    const handleClearHistory = async () => {
        if (!clearStart || !clearEnd || clearStart > clearEnd) {
            alert("Please select a valid date range.");
            return;
        }
        const s = new Date(`${clearStart}T00:00:00`).toISOString();
        const e = new Date(`${clearEnd}T23:59:59.999`).toISOString();
        const resp = await clearHistory(s, e);
        if (resp) {
            setClearStart("");
            setClearEnd("");
            setShowClearSection(false);
            setClearSuccess(true);
        } else {
            alert("Failed to clear history. Please try again.");
        }
    };

    const scrollToClear = () => {
        clearRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowClearSection(true);
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={2000} theme="colored" />
            <section className="w-full px-6 lg:px-10 py-10">
                <div className="lw-section-num mb-2">Archive / Ledger</div>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl text-ink-900 font-semibold leading-tight tracking-tight">
                        Locker <span className="text-brass-500">history.</span>
                    </h1>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {history.length} entries
                    </div>
                </div>
                <div className="lw-rule-brass w-16 mt-5 mb-8" />

                <div className="border border-ink-100 bg-white rounded-xl shadow-paper overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between gap-3 p-4 border-b border-ink-100">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by locker #"
                                value={searchLocker}
                                onChange={(e) => setSearchLocker(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-ink-100 rounded-md text-sm text-ink-900 focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative">
                                <DatePicker
                                    selected={parseDate(startDate)}
                                    onChange={(d) => setStartDate(d ? format(d, "dd-MM-yyyy") : "")}
                                    selectsStart
                                    startDate={parseDate(startDate)}
                                    endDate={parseDate(endDate)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Start date"
                                    className="w-full sm:w-44 px-3 py-2 bg-white border border-ink-100 rounded-md text-sm text-ink-900 focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="relative">
                                <DatePicker
                                    selected={parseDate(endDate)}
                                    onChange={(d) => setEndDate(d ? format(d, "dd-MM-yyyy") : "")}
                                    selectsEnd
                                    startDate={parseDate(startDate)}
                                    endDate={parseDate(endDate)}
                                    minDate={parseDate(startDate)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="End date"
                                    className="w-full sm:w-44 px-3 py-2 bg-white border border-ink-100 rounded-md text-sm text-ink-900 focus:outline-none focus:border-brass-400 focus:ring-2 focus:ring-brass-400/20 placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                onClick={() => { setStartDate(""); setEndDate(""); }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-ink-100 text-slate-600 bg-white text-xs font-medium rounded-md hover:bg-cream-200 hover:text-ink-900 hover:border-ink-200 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" /> Reset
                            </button>
                            <button
                                onClick={scrollToClear}
                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-error-500/30 text-error-600 bg-white text-xs font-medium rounded-md hover:bg-error-50 hover:border-error-500 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Clear range
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-3">
                            <Loader className="w-5 h-5 text-brass-400 animate-spin" />
                            <p className="text-slate-500 text-sm">Loading history…</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="py-14 text-center">
                            <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-cream-200 text-slate-400">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="font-display text-sm font-semibold text-ink-900">No history yet</div>
                            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">Transactions will show up here as lockers are assigned, renewed, or cancelled.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto no-scrollbar">
                                <table className="w-full border-collapse min-w-[900px]">
                                    <thead className="sticky top-0 bg-cream-50">
                                        <tr className="border-b border-ink-200">
                                            {["Locker", "Event", "Holder", "By", "Cost", "Status", "When"].map((h) => (
                                                <th key={h} className="px-3 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item, index) => (
                                            <tr key={index} className="border-b border-ink-100 hover:bg-cream-50/60 transition-colors">
                                                <td className="px-3 py-3 font-mono text-sm text-ink-900">#{item.LockerNumber}</td>
                                                <td className="px-3 py-3 text-sm text-ink-900 max-w-[280px] truncate" title={item.comment}>{item.comment}</td>
                                                <td className="px-3 py-3 text-sm text-ink-900 max-w-[160px] truncate">{item.LockerHolder}</td>
                                                <td className="px-3 py-3 text-sm text-ink-900 max-w-[160px] truncate">{item.InitiatedBy}</td>
                                                <td className="px-3 py-3 font-mono text-xs text-ink-900">{item.Cost || "—"}</td>
                                                <td className="px-3 py-3 font-mono text-xs text-slate-600">{item.LockerStatus}</td>
                                                <td className="px-3 py-3 font-mono text-xs text-ink-900">
                                                    {item.createdAt ? (
                                                        <div className="flex flex-col">
                                                            <span>{new Date(item.createdAt).toLocaleDateString("en-GB")}</span>
                                                            <span className="text-slate-500">
                                                                {String(new Date(item.createdAt).getHours()).padStart(2, "0")}:
                                                                {String(new Date(item.createdAt).getMinutes()).padStart(2, "0")}
                                                            </span>
                                                        </div>
                                                    ) : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-ink-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {startRange}–{endRange} of {history.length}
                                </div>
                                <ReactPaginate
                                    breakLabel={<span className="mx-1">…</span>}
                                    previousLabel={<span className="w-8 h-8 flex items-center justify-center border border-ink-200"><ChevronLeft className="w-3.5 h-3.5" /></span>}
                                    nextLabel={<span className="w-8 h-8 flex items-center justify-center border border-ink-200"><ChevronRight className="w-3.5 h-3.5" /></span>}
                                    pageCount={pageCount}
                                    onPageChange={({ selected }) => setCurrentPage(selected)}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={1}
                                    containerClassName="flex items-center gap-1"
                                    pageClassName="block border border-ink-100 hover:bg-brass-50 hover:text-brass-600 hover:border-brass-400/40 rounded-md w-8 h-8 flex items-center justify-center text-xs font-medium"
                                    activeClassName="bg-brass-400 text-white border-brass-400 hover:!bg-brass-500 hover:!text-white"
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div ref={clearRef} className={`mt-8 ${showClearSection ? "" : "hidden"}`}>
                    <div className="border border-error-500/25 bg-error-50/40 rounded-xl p-6 md:p-8">
                        <div className="lw-eyebrow mb-1 text-error-600">Danger zone</div>
                        <h2 className="font-display text-xl text-ink-900 font-semibold mb-1.5">Clear history range</h2>
                        <p className="text-sm text-slate-500 mb-6">This permanently removes locker transaction records within the selected dates. Use with care.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                            <div>
                                <label className="lw-label">Start date</label>
                                <DatePicker
                                    selected={parseDate1(clearStart)}
                                    onChange={(d) => setClearStart(d ? format(d, "yyyy-MM-dd") : "")}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Start"
                                    className="lw-input"
                                />
                            </div>
                            <div>
                                <label className="lw-label">End date</label>
                                <DatePicker
                                    selected={parseDate1(clearEnd)}
                                    onChange={(d) => setClearEnd(d ? format(d, "yyyy-MM-dd") : "")}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="End"
                                    minDate={parseDate1(clearStart)}
                                    className="lw-input"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => { setClearStart(""); setClearEnd(""); }}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-ink-100 text-slate-600 bg-white text-xs font-medium rounded-md hover:bg-cream-200 hover:text-ink-900 hover:border-ink-200 transition-colors"
                                >
                                    Reset dates
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleClearHistory}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-error-500 hover:bg-error-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear history
                            </button>
                            <button
                                onClick={() => { setShowClearSection(false); setClearStart(""); setClearEnd(""); }}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-ink-100 text-ink-900 bg-white font-medium text-sm rounded-md hover:bg-cream-200 hover:border-ink-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default LockerHistory;
