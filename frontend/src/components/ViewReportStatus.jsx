import React, { useState, useContext, useRef } from "react";
import { AdminContext } from "../context/AdminProvider";
import { Trash2, X, Edit2 } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Layout from "./Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from 'date-fns';
import "font-awesome/css/font-awesome.min.css";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewReportStatus = () => {
    const [issueType, setIssueType] = useState("locker");
    const { lockerIssue, technicalIssue, deleteIssue, updateComment } = useContext(AdminContext);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [expandedRows, setExpandedRows] = useState(new Set());

    const [editableStates, setEditableStates] = useState({}); 
    const [comments, setComments] = useState({});
    const commentRef = useRef({});
    const datePickerRef = useRef(null);
    const [error, setError] = useState("");

    let filterIssues = issueType === "locker" ? lockerIssue || [] : technicalIssue || [];
    filterIssues = filterIssues.filter((item) => {
        const matchesEmail = !searchTerm || item.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !selectedDate || (() => {
            const date = new Date(item.createdAt);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const formattedCreatedDate = `${day}-${month}-${year}`;
            return formattedCreatedDate === selectedDate;
        })();
        return matchesEmail && matchesDate;
    });
    
    const handleEditClick = (id, item) => {
        setEditableStates((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
        if (!editableStates[id]) {
            setComments((prevState) => ({
                ...prevState,
                [id]: item.comment || "",
            }));
            commentRef.current[id]?.focus();
        }
    };

    const handleCancelEdit = (id, item) => {
        setComments((prevState) => ({
            ...prevState,
            [id]: item.comment || "",
        }));
        setEditableStates((prevState) => ({
            ...prevState,
            [id]: false,
        }));
    };

    const handleCommentSubmit = async (id) => {
        try {
            await updateComment(id, comments[id]);
            setEditableStates((prevState) => ({ ...prevState, [id]: false }));
            setComments((prevState) => ({ ...prevState, [id]: comments[id] }));
            toast.success("Comment updated successfully");
        } catch (error) {
            setError("Error updating comment. Please try again later.");
            toast.error("Error updating comment. Please try again later.");
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteIssue(id);
            // Issues will be refreshed by AdminProvider's getAllIssues function
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = (event) => {
        event.preventDefault();
        setSelectedDate(null);
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;
        return parse(dateString, "dd-MM-yyyy", new Date());
    };

    const toggleRowExpansion = (issueId) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(issueId)) {
                newSet.delete(issueId);
            } else {
                newSet.add(issueId);
            }
            return newSet;
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Unresolved":
                return "bg-red-200 text-red-800";
            case "In Action":
                return "bg-yellow-200 text-yellow-800";
            case "Resolved":
                return "bg-green-200 text-green-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <section className="flex flex-col w-full px-4 py-12 gap-4">
                <h1 className="text-5xl font-bold text-gray-900 text-center">
                    View Report Status
                </h1>
                <div className="w-full overflow-x-hidden">
                    <div className="bg-white rounded-2xl shadow-xl relative">
                        <div className="flex flex-wrap justify-end gap-4 p-4 border-b border-gray-200">
                            <Link 
                                to="/issue_reporting" 
                                className="group  hover:bg-gray-400 text-black text-lg font-semibold py-2 px-4 rounded-full border-2 border-gray-400 shadow-md transition-all duration-200 flex items-center gap-2 overflow-hidden"
                            >
                                   Report an Issue
                                
                            </Link>
                        </div>
                        <div className="sticky top-0 z-10 bg-white flex justify-end items-center p-4 gap-4 border-b border-gray-200">
                            <form className="flex flex-row items-center gap-4">
                                <select
                                    id="filter"
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="border-2 border-black px-4 py-2 w-[10rem] rounded-lg shadow-sm focus:outline-none cursor-pointer"
                                >
                                    <option value="locker">Locker</option>
                                    <option value="technical">Technical</option>
                                </select>
                                <div className="relative">
                                    <DatePicker
                                        ref={datePickerRef}
                                        selected={parseDate(selectedDate)}
                                        onChange={(date) => setSelectedDate(format(date, "dd-MM-yyyy"))}
                                        selectsStart
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="Select Date"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className="w-[12rem] p-2 border-2 border-black rounded-lg cursor-pointer"
                                    />
                                    <i 
                                        className="fa fa-calendar absolute right-3 top-3 text-gray-700 cursor-pointer hover:text-gray-900" 
                                        onClick={() => datePickerRef.current?.input?.focus()}
                                    />
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Reset
                                </button>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by Email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-2 border-black w-[15rem] px-4 py-2 rounded-lg shadow-sm focus:outline-none"
                                />
                            </form>
                        </div>
                        <div className="overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-1">
                                <tr className="bg-gray-300 text-black">
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Issue Type</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Subject</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Created Date</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-50">
                                {filterIssues.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            No Reports Found.
                                        </td>
                                    </tr>
                                ) : (
                                    filterIssues.map((item, index) => {
                                        const isExpanded = expandedRows.has(item._id);
                                        const createdDate = item.createdAt
                                            ? (() => {
                                                const date = new Date(item.createdAt);
                                                const day = String(date.getDate()).padStart(2, "0");
                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                const year = date.getFullYear();
                                                return `${day}/${month}/${year}`;
                                            })()
                                            : "N/A";
                                        return (
                                            <React.Fragment key={index}>
                                                <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-white">
                                                    <td className="px-4 py-3 text-gray-800 font-medium">
                                                        {item.type === "technical"
                                                            ? "Technical"
                                                            : `Locker #${item.LockerNumber || "N/A"}`}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700 font-semibold">
                                                        {item.email || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700 font-semibold">
                                                        {item.subject || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold">
                                                        <span
                                                            className={`px-3 py-1 text-sm font-semibold rounded-md ${getStatusColor(item.status)}`}
                                                        >
                                                            {item.status || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700 font-semibold">
                                                        {createdDate}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => toggleRowExpansion(item._id)}
                                                            className="bg-purple-400 hover:bg-purple-600 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors inline-flex items-center gap-2"
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    <FaChevronUp className="text-xs" />
                                                                    Hide Details
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaChevronDown className="text-xs" />
                                                                    View Details
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                        <td colSpan="6" className="px-4 py-4">
                                                            <div className="space-y-4">
                                                                <div className="flex flex-col">
                                                                    <p className="text-sm font-bold text-gray-700 mb-1">Description:</p>
                                                                    <p className="text-base font-semibold text-gray-900">{item.description || "N/A"}</p>
                                                                </div>
                                                                
                                                                <div className="flex flex-col gap-2">
                                                                    <p className="text-sm font-bold text-gray-700">Comment:</p>
                                                                    <div className="flex gap-2 items-start">
                                                                        <div className="relative flex-1 group">
                                                                            <textarea
                                                                                id={`comment-${item._id}`}
                                                                                name={`comment-${item._id}`}
                                                                                type="text"
                                                                        ref={(el) => (commentRef.current[item._id] = el)}
                                                                                readOnly={!editableStates[item._id]}
                                                                                onClick={() => {
                                                                                    if (!editableStates[item._id]) {
                                                                                        handleEditClick(item._id, item);
                                                                                    }
                                                                                }}
                                                                                className={`outline-none w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors cursor-text ${editableStates[item._id] ? "bg-white" : "bg-gray-100"}`}
                                                                                placeholder="Click to add or edit comment"
                                                                                value={comments[item._id] !== undefined ? comments[item._id] : item.comment || ""}
                                                                                onChange={(e) => setComments((prevState) => ({
                                                                                    ...prevState,
                                                                                    [item._id]: e.target.value
                                                                                }))}
                                                                            />
                                                                            {editableStates[item._id] && (
                                                                                <X
                                                                                    className="absolute right-3 top-3 h-5 w-5 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100"
                                                                                    onClick={() => handleCancelEdit(item._id, item)}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        {editableStates[item._id] && (
                                                                            <button
                                                                                onClick={() => handleCommentSubmit(item._id)}
                                                                                className="px-4 py-2 bg-gray-400 text-black rounded-lg hover:bg-gray-500 whitespace-nowrap transition-colors"
                                                                            >
                                                                                Update
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                                                {item.status === "Resolved" && (
                                                                    <div className="flex gap-4">
                                                                        <button
                                                                            onClick={() => handleDelete(item._id)}
                                                                            disabled={loading}
                                                                            className="flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                                        >
                                                                            <Trash2 className="h-5 w-5 text-white" />
                                                                            Delete Issue
                                                                        </button>
                                                                    </div>
                                                                )}
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
                </div>
            </section>
        </Layout>
    );
};

export default ViewReportStatus;
