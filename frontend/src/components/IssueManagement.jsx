import React, { useState, useRef, useContext } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
import { ShieldCheck, Loader, ArrowRightCircle, CheckCircle, X, Edit2, Ban } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from 'date-fns';
import "font-awesome/css/font-awesome.min.css";

const IssueManagement = () => {
    const [issueType, setIssueType] = useState("locker");
    const [loadingStates, setLoadingStates] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const { lockerIssue, technicalIssue, resolveIssue, updateIssue, updateComment } = useContext(AdminContext);

    const [editableStates, setEditableStates] = useState({}); 
    const [comments, setComments] = useState({});
    const commentRef = useRef(null);
    const [error, setError] = useState("");
    const [expandedRows, setExpandedRows] = useState(new Set());

    let filteredIssues = issueType === "locker" ? lockerIssue : technicalIssue;
    filteredIssues = filteredIssues.filter((item) => {
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
            commentRef.current?.focus();
        }
    };

    const handleCommentSubmit = async (id) => {
        try {
            await updateComment(id, comments[id]);  
        } catch (error) {
            //console.error("Error updating comment:", error);
            setError("Error updating comment");
        }
    };

    const setIssueLoading = (id, buttonType, isLoading) => {
        setLoadingStates((prev) => ({ 
            ...prev, 
            [id]: { 
                ...prev[id], 
                [buttonType]: isLoading 
            } 
        }));
    };
       
    const handleResolve = async (id) => {
        setIssueLoading(id, 'resolve', true);
        setError("");
        try {
            await resolveIssue(id);
        } catch (error) {
            //console.error(error);
            setError("Error resolving issue");
        } finally {
            setIssueLoading(id, 'resolve', false);
        }
    };

    const handleUpdate = async (id) => {
        setIssueLoading(id, 'proceed', true);
        setError("");
        try {
            await updateIssue(id);
        } catch (error) {
            //console.error(error);
            setError("Error updating issue");
        } finally {
            setIssueLoading(id, 'proceed', false);
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
            <section className="flex flex-col w-full px-2 sm:px-4 py-6 sm:py-12 gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                    Issue Management
                </h1>
                <div className="w-full overflow-x-auto">
                    <div className="bg-white rounded-2xl shadow-xl relative">
                        <div className="flex flex-wrap justify-end gap-2 sm:gap-4 p-2 sm:p-4 border-b border-gray-200">
                            <Link 
                                to="/issue_reporting" 
                                className="group hover:bg-gray-400 text-black text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-gray-400 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                            >
                                    Report an Issue
                                
                            </Link>
                        </div>              
                        <div className="sticky top-0 z-10 bg-white flex justify-end items-center p-2 sm:p-4 gap-2 sm:gap-4 border-b border-gray-200">
                            <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <select
                                    id="filter"
                                    name="filter"
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="border-2 border-black px-2 sm:px-4 py-1.5 sm:py-2 w-full sm:w-[10rem] rounded-lg shadow-sm focus:outline-none cursor-pointer text-sm sm:text-base"
                                >
                                    <option value="locker">Locker</option>
                                    <option value="technical">Technical</option>
                                </select>
                                <div className="relative">
                                    <DatePicker
                                        selected={parseDate(selectedDate)}
                                        onChange={(date) => setSelectedDate(format(date, "dd-MM-yyyy"))}
                                        selectsStart
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="Select Date"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className="w-full sm:w-[12rem] p-2 border-2 border-black rounded-lg cursor-pointer text-sm sm:text-base"
                                    />
                                    <i className="fa fa-calendar absolute right-3 top-3 text-gray-700" />
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base whitespace-nowrap"
                                >
                                    Reset
                                </button>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by Email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-2 border-black w-full sm:w-[15rem] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm focus:outline-none text-sm sm:text-base"
                                />
                            </form>
                        </div>
                        <div className="overflow-x-auto overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <table className="w-full border-collapse min-w-[700px]">
                                <thead className="sticky top-0 z-1">
                                <tr className="bg-gray-300 text-black">
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Issue Type</th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Email</th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Subject</th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Status</th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Created Date</th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-50">
                                {filteredIssues?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            No Reports Found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredIssues?.map((item, index) => {
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
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-800 font-medium text-xs sm:text-sm">
                                                        {item.type === "technical"
                                                            ? "Technical"
                                                            : `Locker #${item.LockerNumber || "N/A"}`}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                                                        {item.email || "N/A"}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                                        {item.subject || "N/A"}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">
                                                        <span
                                                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-md ${getStatusColor(item.status)}`}
                                                        >
                                                            {item.status || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm">
                                                        {createdDate}
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                        <button
                                                            onClick={() => toggleRowExpansion(item._id)}
                                                            className="bg-purple-400 hover:bg-purple-600 text-white text-xs sm:text-sm font-semibold py-1 px-2 sm:px-3 rounded-lg transition-colors inline-flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    <FaChevronUp className="text-xs" />
                                                                    <span className="hidden sm:inline">Hide Details</span>
                                                                    <span className="sm:hidden">Hide</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaChevronDown className="text-xs" />
                                                                    <span className="hidden sm:inline">View Details</span>
                                                                    <span className="sm:hidden">View</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                        <td colSpan="6" className="px-2 sm:px-4 py-3 sm:py-4">
                                                            <div className="space-y-3 sm:space-y-4">
                                                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                                                    <p className="text-sm sm:text-base font-bold text-gray-700">Description:</p>
                                                                    <p className="text-sm sm:text-base font-semibold text-gray-900">{item.description || "N/A"}</p>
                                                                </div>
                                                                
                                                                <div className="relative group">
                                                                    <p className="text-sm sm:text-base font-bold text-gray-700 mb-2">Comment:</p>
                                                                    <textarea
                                                                        id={`comment-${item._id}`}
                                                                        name={`comment-${item._id}`}
                                                                        type="text"
                                                                        ref={commentRef}
                                                                        readOnly={!editableStates[item._id]}
                                                                        className={`pl-8 sm:pl-10 outline-none w-full py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm sm:text-base ${editableStates[item._id] ? "bg-white" : "bg-gray-100"}`}
                                                                        placeholder="Comment"
                                                                        value={comments[item._id] !== undefined ? comments[item._id] : item.comment || ""}
                                                                        onChange={(e) => setComments((prevState) => ({
                                                                            ...prevState,
                                                                            [item._id]: e.target.value
                                                                        }))}
                                                                    />
                                                                    {editableStates[item._id] ? (
                                                                        <X
                                                                            className="absolute right-2 sm:right-3 top-8 sm:top-9 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100"
                                                                            onClick={() => handleEditClick(item._id, item)}
                                                                        />
                                                                    ) : (
                                                                        <Edit2
                                                                            className="absolute right-2 sm:right-3 top-8 sm:top-9 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100"
                                                                            onClick={() => handleEditClick(item._id, item)}
                                                                        />
                                                                    )}
                                                                </div>

                                                                {editableStates[item._id] && (
                                                                    <div className="flex justify-start items-center gap-2 sm:gap-4">
                                                                        <button
                                                                            onClick={() => handleCommentSubmit(item._id)}
                                                                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-400 text-black rounded-lg hover:bg-gray-500 text-sm sm:text-base"
                                                                        >
                                                                            Update Comment
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

                                                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                                                    <button
                                                                        onClick={() => handleUpdate(item._id)}
                                                                        disabled={(loadingStates[item._id]?.proceed || loadingStates[item._id]?.resolve) || item.status === "In Action" || item.status === "Resolved"}
                                                                        className={`group relative flex justify-center items-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-lg text-white text-xs sm:text-sm ${(loadingStates[item._id]?.proceed || loadingStates[item._id]?.resolve) ? "bg-yellow-500 cursor-not-allowed" : item.status === "In Action" || item.status === "Resolved" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors`}
                                                                    >
                                                                        <span className="flex items-center justify-center gap-1 sm:gap-2">
                                                                            {loadingStates[item._id]?.proceed ? (
                                                                                <Loader className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-spin" />
                                                                            ) : item.status === "In Action" || item.status === "Resolved" ? (
                                                                                <Ban className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                                            ) : (
                                                                                <ArrowRightCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                                            )}
                                                                            {loadingStates[item._id]?.proceed ? "Processing..." : "Proceed"}
                                                                        </span>
                                                                    </button>

                                                                    <button
                                                                        type="submit"
                                                                        onClick={() => handleResolve(item._id)}
                                                                        disabled={(loadingStates[item._id]?.proceed || loadingStates[item._id]?.resolve) || item.status === "Resolved"}
                                                                        className={`group relative flex justify-center items-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-lg text-white text-xs sm:text-sm ${(loadingStates[item._id]?.proceed || loadingStates[item._id]?.resolve) ? "bg-gray-500 cursor-not-allowed" : item.status === "Resolved" ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors`}
                                                                    >
                                                                        <span className="flex items-center justify-center gap-1 sm:gap-2">
                                                                            {loadingStates[item._id]?.resolve ? (
                                                                                <Loader className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-spin" />
                                                                            ) : (
                                                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                                            )}
                                                                            {loadingStates[item._id]?.resolve ? "Loading..." : "Resolved"}
                                                                        </span>
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
                </div>
            </section>
        </Layout>
    );
};

export default IssueManagement;
