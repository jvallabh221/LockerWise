import React, { lazy, useContext, useEffect, useState } from "react";
import { LockerContext } from "../context/LockerProvider";
import { Loader, ShieldCheck, User, Hash, Key, ClipboardType, FolderOpen, Mail, CircleDollarSign, ArrowRightCircleIcon, Phone } from "lucide-react";
import Layout from "./Layout";


const AssignLocker = () => {
    const { availableLockers, allocateLocker } = useContext(LockerContext);

    const [months, setMonths] = useState(null);
    const [empName, setEmpName] = useState(null);
    const [empId, setEmpId] = useState(null);
    const [empEmail, setEmpEmail] = useState(null);
    const [empPhone, setEmpPhone] = useState(null);
    const [cost, setCost] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    useEffect(() => {
        if (months === "3") {
            setCost(availableLockers.data.LockerPrice3Month);
        } else if (months === "6") {
            setCost(availableLockers.data.LockerPrice6Month);
        } else if (months === "12") {
            setCost(availableLockers.data.LockerPrice12Month);
        } else {
            setCost("");
        }
    }, [months]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!months) {
            //console.log("Duration is required.");
            setError("Duration is required.");
            return;
        }
    
        if (months === "customize" && (!startDate || !endDate)) {
            //console.log("Start and end dates are required for custom duration.");
            setError("Start and end dates are required for custom duration.");
            return;
        }   
        
        if (!/^\d*\.?\d*$/.test(cost)) {
            //console.error("Invalid input: Cost must be a positive number.");
            setError("Invalid input: Cost must be a positive number.");
            return;
        }

        setLoading(true);

        try {
            await allocateLocker(
                availableLockers.data.LockerNumber,
                availableLockers.data.LockerType,
                availableLockers.data.LockerCode,
                empName,
                empId,
                empEmail,
                empPhone,
                availableLockers.data.availableForGender,
                cost,
                months,
                startDate,
                endDate
            );
            // console.log("Locker allocated successfully.");
        } catch (error) {
            //console.error("Error allocating locker:", error);
            setError("Error allocating locker. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center px-4 py-24">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-center space-y-2 flex flex-col items-center gap-4">
                     
                        <h1 className="text-3xl flex flex-col font-bold text-gray-900">
                            Assign an Locker To <span>Employee</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="relative">
                            <label htmlFor="number" className="sr-only">
                                Number
                            </label>
                            <div className="flex items-center">
                                <Hash className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="number"
                                    name="number"
                                    type="number"
                                    required
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the locker number"
                                    value={availableLockers.data.LockerNumber}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="code" className="sr-only">
                                Code
                            </label>
                            <div className="flex items-center">
                                <Key className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    required
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the subject"
                                    value={availableLockers.data.LockerCode}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="s-number" className="sr-only">
                                Serial Number
                            </label>
                            <div className="flex items-center">
                                <Hash className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="s-number"
                                    name="s-number"
                                    type="text"
                                    required
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the locker serial number"
                                    value={availableLockers.data.LockerSerialNumber}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="type" className="sr-only">
                                Type
                            </label>
                            <div className="flex items-center">
                                <ClipboardType className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="type"
                                    name="type"
                                    type="text"
                                    required
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the subject"
                                    value={availableLockers.data.LockerType}
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
                                    required
                                    readOnly
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the subject"
                                    value={availableLockers.data.availableForGender}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <div className="flex items-center">
                                <FolderOpen className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the employee name"
                                    value={empName}
                                    onChange={(e) => setEmpName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="Id" className="sr-only">
                                ID
                            </label>
                            <div className="flex items-center">
                                <Hash className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="Id"
                                    name="Id"
                                    type="text"
                                    required
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the employee ID"
                                    value={empId}
                                    onChange={(e) => setEmpId(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <div className="flex items-center">
                                <Mail className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors no-scrollbar whitespace-nowrap"
                                    placeholder="Enter the employee email"
                                    value={empEmail}
                                    onChange={(e) => setEmpEmail(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="Phone" className="sr-only">
                                Phone
                            </label>
                            <div className="flex items-center">
                                <Phone className="absolute left-3 h-5 w-5 text-gray-500" />
                                <input
                                    id="Phone"
                                    name="Phone"
                                    type="text"
                                    required
                                    className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    placeholder="Enter the employee phone number"
                                    value={empPhone}
                                    onChange={(e) => setEmpPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <select
                            id="duration"
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                            className=" outline-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                        >
                            <option value="" disabled selected>
                                Duration
                            </option>
                            <option value="3">3 months</option>
                            <option value="6">6 months</option>
                            <option value="12">12 months</option>
                            <option value="customize">Customize</option>
                        </select>

                        {months === "customize" ? (
                            <>
                                <div className="relative w-full">
                                    <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        required
                                        className=" outline-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                        placeholder="Start date"
                                        value={startDate ? startDate.split("T")[0] : ""} // Ensure startDate is not null
                                        onChange={(e) => {
                                            const selectedDate = new Date(e.target.value);
                                            const now = new Date(); // Get current time
                                            selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()); // Apply current time
                                            setStartDate(selectedDate.toISOString()); // Update startDate state with full ISO string
                                        }}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>

                                <div className="relative w-full">
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        required
                                        className="outline-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                        placeholder="End date"
                                        value={endDate ? endDate.split("T")[0] : ""} // Ensure endDate is not null
                                        onChange={(e) => {
                                            const selectedDate = new Date(e.target.value);
                                            selectedDate.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
                                            setEndDate(selectedDate.toISOString()); // Update endDate state with full ISO string
                                        }}
                                        min={startDate ? startDate.split("T")[0] : ""} // Prevent selecting past dates or invalid startDate
                                    />
                                </div>

                                <div className="relative">
                                    <label htmlFor="cost-manual" className="sr-only">
                                        Cost-manual
                                    </label>
                                    <div className="flex items-center">
                                        <CircleDollarSign className="absolute left-3 h-5 w-5 text-gray-500" />
                                        <input
                                            id="cost-manual"
                                            name="cost-manual"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                            placeholder="Enter the cost"
                                            value={cost}
                                            onChange={(e) => setCost(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative">
                                <label htmlFor="cost-auto" className="sr-only">
                                    Cost-auto
                                </label>
                                <div className="flex items-center">
                                    <CircleDollarSign className="absolute left-3 h-5 w-5 text-gray-500" />
                                    <input
                                        id="cost-auto"
                                        name="cost-auto"
                                        type="text"
                                        required
                                        className="pl-10 outline-none w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                        placeholder="Enter the cost"
                                        value={cost}
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-400 hover:bg-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors`}
                        >
                            <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                                {loading ? <Loader className="h-5 w-5 text-white animate-spin" /> : <ArrowRightCircleIcon className="h-5 w-5 text-white group-hover:text-gray-300" />}
                            </span>
                            {loading ? "Assigning..." : "Assign the locker"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AssignLocker;
