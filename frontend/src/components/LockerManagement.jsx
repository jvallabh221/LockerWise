import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { AuthContext } from "../context/AuthProvider";
import {
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaChevronDown,
  FaChevronUp,
  FaUserPlus
} from "react-icons/fa";
import Layout from "./Layout";
 
const LockerManagement = () => {
  const {
    allLockerDetails,
    allocatedLockerDetails,
    availableLockerDetails,
    expiredLockerDetails,
    maintenanceLockerDetails,
    changeLockerStatus,
  } = useContext(LockerContext);
  const { loginDetails } = useContext(AuthContext);
 
  const [locker, setLocker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
 
  const getStatusColor = (status) => {
    switch (status) {
      case "occupied":
        return "text-green-700 bg-green-100";
      case "available":
        return "text-gray-700 bg-gray-100";
      case "expired":
        return "text-red-700 bg-red-100";
      case "maintainance":
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };
 
  let filteredLockers = allLockerDetails;
  if (locker === "expired") {
    filteredLockers = expiredLockerDetails;
  } else if (locker === "allocated") {
    filteredLockers = allocatedLockerDetails;
  } else if (locker === "available") {
    filteredLockers = availableLockerDetails;
  } else if (locker === "maintainance") {
    filteredLockers = maintenanceLockerDetails;
  }
 
  filteredLockers = filteredLockers.filter(
    (item) =>
      !searchTerm ||
      (item.employeeEmail &&
        item.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.employeeId && 
        item.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) // Check employeeId
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
      <section className="flex flex-col w-full px-2 sm:px-4 py-6 sm:py-12 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
                Locker Management
              </h1>
        <div className="bg-white rounded-2xl shadow-xl relative">
            {loginDetails?.role === "Admin" && (
              <>
             
          <div className="flex flex-wrap justify-start gap-2 sm:gap-4 p-2 sm:p-4 border-b border-gray-200 rounded-t-2xl">
                  {/* Add Locker */}
                  <Link 
                    to="/add_single_locker"
                    className="group bg-purple-50 hover:bg-purple-500 text-purple-500 hover:text-white text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-purple-500 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                  >
                    <FaPlus className="text-purple-500 group-hover:text-white transition-colors duration-200" />
                    <span className="w-full whitespace-nowrap">
                      Add Locker
                    </span>
                  </Link>

                  {/* Delete Locker */}
                  <Link 
                    to="/delete_locker"
                    className="group bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-red-500 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                  >
                    <FaTrash className="text-red-500 group-hover:text-white transition-colors duration-200" />
                    <span className="w-full whitespace-nowrap">
                      Delete Locker
                    </span>
                  </Link>

                  {/* Update Locker Price */}
                  <Link 
                    to="/update_locker_price"
                    className="group bg-green-50 hover:bg-green-500 text-green-500 hover:text-white text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-green-500 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                  >
                    <FaPencilAlt className="text-green-500 group-hover:text-white transition-colors duration-200" />
                    <span className="w-full whitespace-nowrap">
                      Update Locker Price
                    </span>
                  </Link>

                </div>

            </>
            )}
            {loginDetails?.role === "Staff" && (
              <>
                <div className="flex flex-wrap justify-start gap-2 sm:gap-4 p-2 sm:p-4 border-b border-gray-200 rounded-t-2xl">
                  {/* Assign Locker */}
                  <Link
                    to="/available_lockers"
                    className="group hover:bg-purple-500 text-purple-500 hover:text-white text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-purple-500 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                  >
                    <FaUserPlus className="text-purple-500 group-hover:text-white transition-colors duration-200" />
                    <span className="w-full whitespace-nowrap">
                      Assign Locker
                    </span>
                  </Link>

                  {/* Cancel Locker */}
                  <Link
                    to="/cancel_locker"
                    className="group bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-red-500 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                  >
                    <FaTrash className="text-red-500 group-hover:text-white transition-colors duration-200" />
                    <span className="w-full whitespace-nowrap">
                      Cancel Locker
                    </span>
                  </Link>

                  {/* Update Locker */}
                  <Link
                    to="/update_locker"
                    className="group bg-green-50 hover:bg-green-500 text-green-500 hover:text-white text-sm sm:text-base md:text-lg font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-full border-2 border-green-500 shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 overflow-hidden"
                  >
                    <FaPencilAlt className="text-green-500 group-hover:text-white transition-colors duration-200" />
                    <span className="w-full whitespace-nowrap">
                      Update Locker
                    </span>
                  </Link>
                </div>
              </>
            )}
            <div className="sticky top-0 z-10 bg-white flex justify-end items-center p-2 sm:p-4 gap-2 sm:gap-4 border-b border-gray-200">
              <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <select
                  id="filter"
                  value={locker}
                  onChange={(e) => setLocker(e.target.value)}
                  className="border-2 border-gray-300 px-2 sm:px-4 py-1.5 sm:py-2 w-full sm:w-[10rem] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer bg-white text-sm sm:text-base"
                >
                  <option value="all lockers">All Lockers</option>
                  <option value="expired">Expired</option>
                  <option value="available">Available</option>
                  <option value="allocated">Allocated</option>
                  <option value="maintainance">Maintainance</option>
                </select>

                <input
                  type="text"
                  name="search"
                  placeholder="Search by Email or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-300 w-full sm:w-[15rem] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
                />
              </form>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full border-collapse min-w-[800px]">
                <thead className="sticky top-0 z-1">
                  <tr className="bg-gray-300 text-black">
                    <th className="px-1 sm:px-2 py-2 sm:py-3 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Locker ID</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Email</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Name</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Employee ID</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Phone</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Status</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Expires On</th>
                    <th className="px-1 sm:px-2 py-2 text-left font-semibold border-b border-gray-500 text-xs sm:text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50">
                {filteredLockers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No lockers found
                    </td>
                  </tr>
                ) : (
                  filteredLockers.map((item, index) => {
                    const isExpanded = expandedRows.has(item.LockerNumber);
                    return (
                      <React.Fragment key={index}>
                        <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-white">
                          <td className="px-1 sm:px-2 py-2 sm:py-3 text-gray-800 font-medium text-xs sm:text-sm">
                            #{item.LockerNumber}
                          </td>
                          <td className="px-1 sm:px-2 py-2 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                            {item.employeeEmail || "N/A"}
                          </td>
                          <td className="px-1 sm:px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                            {item.employeeName || "N/A"}
                          </td>
                          <td className="px-1 sm:px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">
                            {item.employeeId || "N/A"}
                          </td>
                          <td className="px-1 sm:px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">
                            {item.employeePhone || "N/A"}
                          </td>
                          <td className="px-1 sm:px-2 py-2 font-semibold">
                            {(item.LockerStatus === "occupied" || item.LockerStatus === "expired") ? (
                              <span
                                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-md ${getStatusColor(item.LockerStatus)}`}
                              >
                                {item.LockerStatus.charAt(0).toUpperCase() + item.LockerStatus.slice(1)}
                              </span>
                            ) : (
                              <select
                                value={item.LockerStatus || ""}
                                name="status"
                                className={`text-xs sm:text-sm font-medium rounded px-1 sm:px-2 py-1 border-none outline-none cursor-pointer ${getStatusColor(item.LockerStatus)}`}
                                onChange={(e) => changeLockerStatus(item.LockerNumber, e.target.value)}
                              >
                                <option value="available">Available</option>
                                <option value="maintainance">Maintainance</option>
                              </select>
                            )}
                          </td>
                          <td className="px-1 sm:px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">
                            {item.expiresOn
                              ? new Date(item.expiresOn).toISOString().split("T")[0]
                              : "Nil"}
                          </td>
                          <td className="px-1 sm:px-2 py-2">
                            <button
                              onClick={() => toggleRowExpansion(item.LockerNumber)}
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
                            <td colSpan="8" className="px-2 sm:px-4 py-2 sm:py-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <p className="text-sm sm:text-base font-bold text-gray-700">Gender:</p>
                                  <p className="text-sm sm:text-base font-semibold text-gray-900">{item.availableForGender || "N/A"}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <p className="text-sm sm:text-base font-bold text-gray-700">Type:</p>
                                  <p className="text-sm sm:text-base font-semibold text-gray-900">{item.LockerType || "N/A"}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <p className="text-sm sm:text-base font-bold text-gray-700">Duration:</p>
                                  <p className="text-sm sm:text-base font-semibold text-gray-900">{item.Duration || "N/A"}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <p className="text-sm sm:text-base font-bold text-gray-700">Created On:</p>
                                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    {item.createdAt
                                      ? new Date(item.createdAt).toISOString().split("T")[0]
                                      : "Nil"}
                                  </p>
                                </div>
                              </div>
                              {item.LockerStatus === "occupied" && (
                                <div className="mt-3 sm:mt-4">
                                  <Link
                                    onClick={() => { setLoading(true) }}
                                    className="bg-gray-400 hover:bg-gray-500 text-black text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors inline-block"
                                    to={"/editLockerDetails"}
                                    state={item}
                                  >
                                    Edit Locker
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
 
export default LockerManagement;