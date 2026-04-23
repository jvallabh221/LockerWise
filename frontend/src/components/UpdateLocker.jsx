import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { LockerContext } from "../context/LockerProvider";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const UpdateLocker = () => {
    const { expiredLockerDetails } = useContext(LockerContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState(new Set());

    const filteredLockers = expiredLockerDetails.filter(
        (item) =>
            !searchTerm ||
            (item.employeeEmail &&
                item.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.employeeName &&
                item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.LockerNumber &&
                item.LockerNumber.toString().includes(searchTerm))
    );

    const toggleRowExpansion = (lockerNumber) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(lockerNumber)) {
                newSet.delete(lockerNumber);
            } else {
                newSet.add(lockerNumber);
            }
            return newSet;
        });
    };

    return (
        <Layout>
            <section className="flex flex-col w-full px-4 py-12 gap-4">
                <h1 className="text-5xl font-bold text-gray-900 text-center">
                    Update Lockers
                </h1>
                <div className="w-full overflow-x-hidden">
                    <div className="bg-white rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="sticky top-0 z-10 bg-white flex justify-end items-center p-4 gap-4 border-b border-gray-200 rounded-t-2xl">
                            <form className="flex flex-row items-center gap-4">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by Email, Name, or Locker Number"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-2 border-black w-[20rem] px-4 py-2 rounded-lg shadow-sm focus:outline-none"
                                />
                            </form>
                        </div>
                        <div className="overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-1">
                                    <tr className="bg-gray-300 text-black">
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Locker ID</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Gender</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Type</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Phone</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Next Combination</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Expires On</th>
                                        <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-50">
                                    {filteredLockers.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                                No expired lockers found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLockers.map((item, index) => {
                                            const isExpanded = expandedRows.has(item.LockerNumber);
                                            return (
                                                <React.Fragment key={index}>
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-white">
                                                        <td className="px-4 py-3 text-gray-800 font-medium">
                                                            #{item.LockerNumber}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold truncate">
                                                            {item.employeeEmail || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold">
                                                            {item.employeeName || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold">
                                                            {item.availableForGender || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold">
                                                            {item.LockerType || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold">
                                                            {item.employeePhone || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold">
                                                            {item.nextLockerCombination || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 font-semibold">
                                                            {item.expiresOn
                                                                ? new Date(item.expiresOn).toISOString().split("T")[0]
                                                                : "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold">
                                                            <button
                                                                onClick={() => toggleRowExpansion(item.LockerNumber)}
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
                                                            <td colSpan="9" className="px-4 py-4">
                                                                <div className="flex flex-col gap-4">
                                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                                                        <div className="flex flex-col gap-1">
                                                                            <p className="text-sm font-bold text-gray-700">Employee ID:</p>
                                                                            <p className="text-base font-semibold text-gray-900">{item.employeeId || "N/A"}</p>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <p className="text-sm font-bold text-gray-700">Duration:</p>
                                                                            <p className="text-base font-semibold text-gray-900">{item.Duration || "N/A"}</p>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <p className="text-sm font-bold text-gray-700">Created On:</p>
                                                                            <p className="text-base font-semibold text-gray-900">
                                                                                {item.createdAt
                                                                                    ? new Date(item.createdAt).toISOString().split("T")[0]
                                                                                    : "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-row gap-4 mt-2">
                                                                        <Link
                                                                            to={"/update_locker_feature"}
                                                                            state={{ LockerNumber: item.LockerNumber, employeeEmail: item.employeeEmail }}
                                                                            className="bg-gray-400 hover:bg-gray-500 text-black text-sm font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
                                                                        >
                                                                            Reset
                                                                        </Link>
                                                                        <Link
                                                                            to={"/renew_locker"}
                                                                            state={{
                                                                                LockerNumber: item.LockerNumber,
                                                                                LockerPrice3Month: item.LockerPrice3Month,
                                                                                LockerPrice6Month: item.LockerPrice6Month,
                                                                                LockerPrice12Month: item.LockerPrice12Month,
                                                                                employeeEmail: item.employeeEmail,
                                                                                employeeName: item.employeeName,
                                                                            }}
                                                                            className="bg-gray-400 hover:bg-gray-500 text-black text-sm font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
                                                                        >
                                                                            Renew
                                                                        </Link>
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

export default UpdateLocker;
