import React, { useState, lazy, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { AdminContext } from "../context/AdminProvider";
import { Mail, Loader, Lock, BadgeAlert, BookOpen, Send, AlertTriangle, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
 
 
const LockerIssue = () => {
    const navigate = useNavigate();
    const [lockerNumber, setLockerNumber] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
 
    const { handleLockerIssue } = useContext(LockerContext);
    const { getAllIssues } = useContext(AdminContext);
 
    const handleLockerNumber = (e) => {
        setLockerNumber(e.target.value);
    };
 
    const handleSubject = (e) => {
        setSubject(e.target.value);
    };
 
    const handleDescription = (e) => {
        setDescription(e.target.value);
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!/^\d*\.?\d*$/.test(lockerNumber)) {
            //console.error("Invalid input: Locker Number must be a positive number.");
            setError("Invalid input: Locker Number must be a positive number.");
            return;
        }

        setLoading(true);
        
        try {
            await handleLockerIssue(subject, description, lockerNumber, email);
            try {
                if (getAllIssues) await getAllIssues();
            } catch (e) {
                // Ignore refetch errors (e.g. non-admin); issues list will refresh on next load
            }
            navigate("/dashboard");
        } catch (error) {
            //console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                       
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Report a Locker Issue
                        </h1>
                        <p className="text-sm text-gray-600">
                            Report any issues or problems with your locker
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Locker Number and Email in one row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center">
                                <label htmlFor="number" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                    Locker Number
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <Hash className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="number"
                                            name="number"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Locker Number"
                                            value={lockerNumber}
                                            onChange={handleLockerNumber}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                    Email
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <Mail className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Email ID"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        <div className="flex items-center">
                            <label htmlFor="subject" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Subject
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <BookOpen className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Subject"
                                        value={subject}
                                        onChange={handleSubject}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="description" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Description
                            </label>
                            <div className="relative flex-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows="4"
                                    className="outline-none w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm resize-none"
                                    placeholder="Describe the issue in detail..."
                                    value={description}
                                    onChange={handleDescription}
                                />
                            </div>
                        </div>
 
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-black transition-colors shadow-md ${
                                loading 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-gray-400 hover:bg-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Reporting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Issue
                                </>
                            )}
                        </button>
 
 
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">
                            Need to Raise Technical Issue?{" "}
                            <Link to={"/technical_issue"} className="text-gray-600 hover:underline cursor-pointer font-medium">
                                Technical Issue
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </Layout>
    );
};
 
export default LockerIssue;