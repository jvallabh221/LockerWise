import React, { useState, useContext, useEffect } from "react";
import Layout from "./Layout";
import { LockerContext } from "../context/LockerProvider";
import { FaEnvelope, FaGenderless, FaClock, FaUser, FaPhone, FaCalendarAlt } from "react-icons/fa";

const LockerAnalysis = () => {
    const { expireIn7Days, expireIn1Day } = useContext(LockerContext);

    let lockers = expireIn7Days?.data || [];
    let smallLocker = expireIn1Day?.data || [];

    const [filterType, setFilterType] = useState("all"); // "all", "today", "7days"
    const [allLockers, setAllLockers] = useState([]);

    useEffect(() => {
        // Combine all lockers (both today and 7 days)
        if (Array.isArray(lockers) && Array.isArray(smallLocker)) {
            // Mark today's lockers
            const todayLockers = smallLocker.map(item => ({ ...item, isToday: true }));
            // Mark 7 days lockers (excluding today's)
            const todayIds = smallLocker.map((item) => item._id);
            const sevenDaysLockers = lockers
                .filter((item) => !todayIds.includes(item._id))
                .map(item => ({ ...item, isToday: false }));
            
            // Combine all lockers
            setAllLockers([...todayLockers, ...sevenDaysLockers]);
        } else {
            setAllLockers([]);
        }
    }, [lockers, smallLocker]);

    // Filter lockers based on selected filter
    const filteredLockers = allLockers.filter((item) => {
        if (filterType === "all") return true;
        if (filterType === "today") return item.isToday === true;
        if (filterType === "7days") return item.isToday === false;
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "occupied":
                return "text-green-700 bg-green-100";
            case "available":
                return "text-gray-700 bg-gray-100";
            case "expired":
                return "text-red-700 bg-red-100";
            default:
                return "text-gray-700 bg-gray-100";
        }
    };

    return (
        <Layout>
            <section className="flex flex-col w-full px-4 py-12 gap-4">
                <h1 className="text-5xl font-bold text-gray-900 text-center">
                    Locker Analysis
                </h1>
                
                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-xl relative">
                    <div className="sticky top-0 z-10 bg-white flex justify-end items-center p-4 gap-4 border-b border-gray-200 rounded-t-2xl">
                        <select
                            id="filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="border-2 border-gray-300 px-4 py-2 w-[12rem] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer bg-white"
                        >
                            <option value="all">All Lockers</option>
                            <option value="today">Today</option>
                            <option value="7days">7 Days</option>
                        </select>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-1">
                                <tr className="bg-gray-300 text-black">
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Locker ID</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Phone</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Gender</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Type</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Duration</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Expires On</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-50">
                                {filteredLockers.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-8 text-center text-gray-600">
                                            No lockers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLockers.map((item, index) => (
                                        <tr 
                                            key={index} 
                                            className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-white"
                                        >
                                            <td className="px-4 py-3 text-gray-900 font-medium">
                                                #{item.LockerNumber}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.employeeName || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-500" />
                                                    <span className="no-scrollbar whitespace-nowrap">{item.employeeEmail || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <FaPhone className="text-gray-500" />
                                                    <span>{item.employeePhone || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.availableForGender || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.LockerType || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.Duration || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-gray-500" />
                                                    <span>{item.expiresOn ? new Date(item.expiresOn).toISOString().split("T")[0] : "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-sm font-medium rounded px-2 py-1 ${getStatusColor(item.LockerStatus)}`}>
                                                    {item.LockerStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default LockerAnalysis;
