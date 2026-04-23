import React, { useState, lazy, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { Loader, Hash, User, DollarSign, RefreshCw, Mail, Calendar, AlertTriangle } from "lucide-react";

const getRenewLockerErrorMessage = (backendMessage) => {
    return backendMessage || "No locker matched.";
};

const RenewLocker = () => {
    const location = useLocation();
    const [cost, setCost] = useState(null);
    const [months, setMonths] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState("");

    const { handleRenewLocker } = useContext(LockerContext);

    const { LockerNumber, employeeName, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month, employeeEmail } = location.state || {};

    useEffect(() => {
        if (months === "3") {
            setCost(LockerPrice3Month);
        } else if (months === "6") {
            setCost(LockerPrice6Month);
        } else if (months === "12") {
            setCost(LockerPrice12Month);
        } else {
            setCost("");
        }
    }, [months]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Basic validation
        if (!months) {
            setError("Duration is required.");
            return;
        }
    
        if (months === "customize" && (!startDate || !endDate)) {
            setError("Start and end dates are required for custom duration.");
            return;
        }
        
        if (!/^\d*\.?\d*$/.test(cost)) {
            setError("Invalid input: Price must be a positive number.");
            return;
        }
        setLoading(true);
        try {
            await handleRenewLocker(LockerNumber, cost, months, startDate, endDate, employeeEmail);
        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(getRenewLockerErrorMessage(backendMessage));
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
                            Renew the Current Locker
                        </h1>
                        <p className="text-sm text-gray-600">
                            Renew the locker subscription for the selected locker
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Locker Number and Employee Name in one row */}
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
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-gray-50"
                                            placeholder="Locker Number"
                                            value={LockerNumber || ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="code" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                    Employee Name
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <User className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="code"
                                            name="code"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-gray-50"
                                            placeholder="Employee Name"
                                            value={employeeName || ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Email
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Mail className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-gray-50"
                                        placeholder="Enter the email"
                                        value={employeeEmail || ""}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="duration" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Duration
                            </label>
                            <div className="relative flex-1">
                                <select
                                    id="duration"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    className="outline-none w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                >
                                    <option value="" disabled>
                                        Select Duration
                                    </option>
                                    <option value="3">3 months</option>
                                    <option value="6">6 months</option>
                                    <option value="12">12 months</option>
                                    <option value="customize">Customize</option>
                                </select>
                            </div>
                        </div>

                        {months === "customize" ? (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center">
                                        <label htmlFor="start-date" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                            Start Date
                                        </label>
                                        <div className="relative flex-1">
                                            <div className="flex items-center">
                                                <Calendar className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                <input
                                                    id="start-date"
                                                    name="start-date"
                                                    type="date"
                                                    required
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                    value={startDate ? startDate.split("T")[0] : ""}
                                                    onChange={(e) => {
                                                        const selectedDate = new Date(e.target.value);
                                                        const now = new Date();
                                                        selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                                                        setStartDate(selectedDate.toISOString());
                                                    }}
                                                    min={new Date().toISOString().split("T")[0]}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <label htmlFor="end-date" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                            End Date
                                        </label>
                                        <div className="relative flex-1">
                                            <div className="flex items-center">
                                                <Calendar className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                <input
                                                    id="end-date"
                                                    name="end-date"
                                                    type="date"
                                                    required
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                    value={endDate ? endDate.split("T")[0] : ""}
                                                    onChange={(e) => {
                                                        const selectedDate = new Date(e.target.value);
                                                        selectedDate.setHours(23, 59, 59, 999);
                                                        setEndDate(selectedDate.toISOString());
                                                    }}
                                                    min={startDate ? startDate.split("T")[0] : ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <label htmlFor="cost-manual" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                        Cost
                                    </label>
                                    <div className="relative flex-1">
                                        <div className="flex items-center">
                                            <DollarSign className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                            <input
                                                id="cost-manual"
                                                name="cost-manual"
                                                type="text"
                                                required
                                                className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                placeholder="Enter the cost"
                                                value={cost || ""}
                                                onChange={(e) => setCost(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center">
                                <label htmlFor="cost-auto" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Cost
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <DollarSign className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="cost-auto"
                                            name="cost-auto"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Enter the cost"
                                            value={cost || ""}
                                            onChange={(e) => setCost(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                loading 
                                    ? "bg-green-500 cursor-not-allowed" 
                                    : "bg-green-600 hover:bg-green-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Renewing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5" />
                                    Renew Locker
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default RenewLocker;
