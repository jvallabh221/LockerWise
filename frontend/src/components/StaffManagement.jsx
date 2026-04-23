import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
import { FaPlus } from "react-icons/fa";
import Layout from "./Layout";

const StaffManagement = () => {
  const { staffs, handleStaffDetails } = useContext(AdminContext);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await handleStaffDetails(id);
      navigate("/view_staff_details");
    } catch (error) {
      setError("Failed to delete staff. Please try again later.");
    }
  };

  const handleEdit = async (id) => {
    try {
      await handleStaffDetails(id);
      navigate("/edit_staff_details");
    } catch (error) {
      setError("Failed to edit staff. Please try again later.");
    }
  };

  const filteredStaffs = staffs.filter((item) =>
    !searchTerm ||
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.phoneNumber && item.phoneNumber.includes(searchTerm))
  );

  return (
    <Layout>
      <section className="flex flex-col w-full px-4 py-12 gap-4">
        <h1 className="text-5xl font-bold text-gray-900 text-center">
          Staff Management
        </h1>
        <div className="w-full overflow-x-auto rounded-2xl">
          <div className="bg-white rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto relative">
            <div className="flex flex-wrap justify-end gap-4 p-4 border-b border-gray-200">
              <Link
                to={"/add_single_staff"}
                className="group  hover:bg-gray-400 text-black text-lg font-semibold py-2 px-4 rounded-full border-2 border-gray-400 shadow-md transition-all duration-200 flex items-center gap-2 overflow-hidden"
              >
                <FaPlus className="text-gray-900 group-hover:text-white transition-colors duration-200" />
                  Add Staff
              
              </Link>
            </div>
            <div className="sticky top-0 z-10 bg-white flex justify-end items-center p-4 gap-4 border-b border-gray-200">
              <input
                type="text"
                name="search"
                placeholder="Search by Name, Email or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-black w-[20rem] px-4 py-2 rounded-lg shadow-sm focus:outline-none"
              />
            </div>
            <table className="w-full border-collapse">
              <thead className="sticky top-[73px] z-1">
                <tr className="bg-gray-300 text-black">
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-500">Name</th>
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-500">Gender</th>
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-500">Email</th>
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-500">Phone</th>
                  <th className="px-4 py-3 text-center font-semibold border-b border-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="bg-gray-50">
                {filteredStaffs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No staff found
                    </td>
                  </tr>
                ) : (
                  filteredStaffs.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-white text-center">
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {item.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">
                        <span className="text-sm font-medium rounded px-2 py-1 bg-gray-200 text-gray-800">
                          {item.gender || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">
                        {item.email || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">
                        {item.phoneNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="bg-gray-400 hover:bg-gray-500 text-black text-sm font-semibold py-1 px-3 rounded-lg transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors"
                          >
                            Delete
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
          <div className="w-full text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default StaffManagement;
