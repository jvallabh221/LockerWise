import React, { useState, useContext, lazy } from "react";
import Layout from "./Layout";
import { AdminContext } from "../context/AdminProvider";
import { Loader, BadgeAlert, FolderPen, User, Mail, UserPen, ArrowRightCircleIcon } from "lucide-react";


const ViewStaffDetails = () => {
    const { staffDetails, deleteStaff } = useContext(AdminContext);
    const [loading, setLoading] = useState(null);
    const [err, setErr] = useState("");

    const details = staffDetails.user;

    const handleSubmit = async (e, id) => {
        e.preventDefault();
        setLoading(true);
        setErr("");
        try {
            await deleteStaff(id);
        } catch (error) {
            //console.error(error);
            setErr(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center py-24">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-center space-y-2 flex flex-col items-center gap-4">
                        <div className="flex justify-center ">
                            <BadgeAlert className="w-16 h-16 text-gray-600" />
                        </div>
                        <h1 className="text-3xl flex flex-col font-bold text-gray-900">
                            Delete A Staff From The<span>Network</span>
                        </h1>
                    </div>

                    <form
                        onSubmit={(e) => {
                            handleSubmit(e, details._id);
                        }}
                        className="mt-8 space-y-6"
                    >
                        <div className="relative">
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <div className="flex items-center">
                                <FolderPen className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the subject"
                                    value={details.name}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="gender" className="sr-only">
                                Gender
                            </label>
                            <div className="flex items-center">
                                <User className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="gender"
                                    name="gender"
                                    type="text"
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter your description"
                                    value={details.gender}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="email" className="sr-only">
                                Mail
                            </label>
                            <div className="flex items-center">
                                <Mail className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors no-scrollbar whitespace-nowrap"
                                    placeholder="Enter your Email"
                                    value={details.email}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="role" className="sr-only">
                                Role
                            </label>
                            <div className="flex items-center">
                                <UserPen className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="role"
                                    name="role"
                                    type="text"
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter your role"
                                    value={details.role}
                                />
                            </div>
                        </div>

                        {err && <p className="text-red-500 text-sm text-center mt-2">{err}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-400 hover:bg-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors`}
                        >
                            <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                                {loading ? <Loader className="h-5 w-5 text-white animate-spin" /> : <ArrowRightCircleIcon className="h-5 w-5 text-white group-hover:text-gray-300" />}
                            </span>
                            {loading ? "Deleting..." : "Delete the Staff"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ViewStaffDetails;
