import React, { useState, lazy, useContext, useEffect } from "react";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { Search, Loader, CheckCircle, Hash, Key, ClipboardType, User, FolderOpen, Mail, Phone, DollarSign, Calendar, AlertTriangle, UserPlus } from "lucide-react";


const AvailableLockers = () => {
    const { availableLocker, availableLockers, setAvailableLockers, allocateLocker } = useContext(LockerContext);

    const [lockerType, setLockerType] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const [availableError, setAvailableError] = useState("");

    // Assign locker states
    const [months, setMonths] = useState(null);
    const [empName, setEmpName] = useState(null);
    const [empId, setEmpId] = useState(null);
    const [empEmail, setEmpEmail] = useState(null);
    const [empPhone, setEmpPhone] = useState(null);
    const [cost, setCost] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignError, setAssignError] = useState("");

    // Clear available lockers when locker type or gender changes
    useEffect(() => {
        if (availableLockers) {
            setAvailableLockers(null);
            // Reset assign form states
            setMonths(null);
            setEmpName(null);
            setEmpId(null);
            setEmpEmail(null);
            setEmpPhone(null);
            setCost(null);
            setStartDate(null);
            setEndDate(null);
            setAssignError("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockerType, gender]);

    useEffect(() => {
        if (months === "3" && availableLockers?.data) {
            setCost(availableLockers.data.LockerPrice3Month);
        } else if (months === "6" && availableLockers?.data) {
            setCost(availableLockers.data.LockerPrice6Month);
        } else if (months === "12" && availableLockers?.data) {
            setCost(availableLockers.data.LockerPrice12Month);
        } else {
            setCost("");
        }
    }, [months, availableLockers]);

    const handleLockerType = (e) => {
        setLockerType(e.target.value);
    };

    const handleGender = (e) => {
        setGender(e.target.value);
    };

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setAvailableError("");
        setLoading(true);
        try {
            await availableLocker(lockerType, gender);
        } catch (error) {
            setAvailableError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignLocker = async (e) => {
        e.preventDefault();
        setAssignError("");

        if (!months) {
            setAssignError("Duration is required.");
            return;
        }
    
        if (months === "customize" && (!startDate || !endDate)) {
            setAssignError("Start and end dates are required for custom duration.");
            return;
        }   
        
        if (!/^\d*\.?\d*$/.test(cost)) {
            setAssignError("Invalid input: Cost must be a positive number.");
            return;
        }

        setAssignLoading(true);

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
        } catch (error) {
            setAssignError("Error allocating locker. Please try again.");
        } finally {
            setAssignLoading(false);
        }
    };

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl space-y-6">
                    {/* Check Availability Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="text-center flex flex-col items-center gap-3 mb-6">
                            
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Check Locker Availability
                        </h1>
                            <p className="text-sm text-gray-600">
                                Search for available lockers by type and gender
                            </p>
                    </div>

                        <form onSubmit={handleCheckAvailability} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center">
                                    <label htmlFor="lockerType" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Locker Type
                            </label>
                            <div className="relative flex-1">
                            <select
                                id="lockerType"
                                value={lockerType}
                                onChange={handleLockerType}
                                required
                                    className="outline-none w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                            >
                                    <option value="" disabled>
                                        Select Locker Type
                                </option>
                                <option value="half">Half</option>
                                <option value="full">Full</option>
                            </select>
                            </div>
                        </div>

                        <div className="flex items-center">
                                    <label htmlFor="gender" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Gender
                            </label>
                            <div className="relative flex-1">
                            <select
                                id="gender"
                                value={gender}
                                onChange={handleGender}
                                required
                                    className="outline-none w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                            >
                                    <option value="" disabled>
                                        Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            </div>
                                </div>
                        </div>

                            {availableError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-sm font-medium text-red-800">{availableError}</p>
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
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Check Availability
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Assign Locker Form - Show when data is available */}
                    {availableLockers?.data && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="text-center flex flex-col items-center gap-3 mb-6">
                                
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    Assign Locker
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Locker found! Fill in the user's details to assign
                                </p>
                            </div>

                            <form onSubmit={handleAssignLocker} className="space-y-4">
                                {/* Read-only locker details */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center">
                                        <p className="text-xs font-bold text-gray-700 w-24 flex-shrink-0">Locker Number:</p>
                                        <p className="text-sm font-semibold text-gray-900">{availableLockers.data.LockerNumber}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-xs font-bold text-gray-700 w-24 flex-shrink-0">Locker Code:</p>
                                        <p className="text-sm font-semibold text-gray-900">{availableLockers.data.LockerCode}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-xs font-bold text-gray-700 w-24 flex-shrink-0">Type:</p>
                                        <p className="text-sm font-semibold text-gray-900">{availableLockers.data.LockerType}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-xs font-bold text-gray-700 w-24 flex-shrink-0">Serial Number:</p>
                                        <p className="text-sm font-semibold text-gray-900">{availableLockers.data.LockerSerialNumber}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-xs font-bold text-gray-700 w-24 flex-shrink-0">Gender:</p>
                                        <p className="text-sm font-semibold text-gray-900">{availableLockers.data.availableForGender}</p>
                                    </div>
                                </div>

                                {/* Employee details */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center">
                                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                            Name
                                        </label>
                                        <div className="relative flex-1">
                                            <div className="flex items-center">
                                                <FolderOpen className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                    placeholder="Name"
                                                    value={empName || ""}
                                                    onChange={(e) => setEmpName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <label htmlFor="Id" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                            ID
                                        </label>
                                        <div className="relative flex-1">
                                            <div className="flex items-center">
                                                <Hash className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                <input
                                                    id="Id"
                                                    name="Id"
                                                    type="text"
                                                    required
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                    placeholder="ID"
                                                    value={empId || ""}
                                                    onChange={(e) => setEmpId(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center">
                                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
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
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                    placeholder="Email"
                                                    value={empEmail || ""}
                                                    onChange={(e) => setEmpEmail(e.target.value)}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <label htmlFor="Phone" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                            Phone
                                        </label>
                                        <div className="relative flex-1">
                                            <div className="flex items-center">
                                                <Phone className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                <input
                                                    id="Phone"
                                                    name="Phone"
                                                    type="text"
                                                    required
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                                    placeholder="Phone"
                                                    value={empPhone || ""}
                                                    onChange={(e) => setEmpPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <label htmlFor="duration" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                        Duration
                                    </label>
                                    <div className="relative flex-1">
                                        <select
                                            id="duration"
                                            value={months || ""}
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
                                                <label htmlFor="startDate" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                                    Start Date
                                                </label>
                                                <div className="relative flex-1">
                                                    <div className="flex items-center">
                                                        <Calendar className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                        <input
                                                            id="startDate"
                                                            name="startDate"
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
                                                <label htmlFor="endDate" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                                    End Date
                                                </label>
                                                <div className="relative flex-1">
                                                    <div className="flex items-center">
                                                        <Calendar className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                                        <input
                                                            id="endDate"
                                                            name="endDate"
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
                                            <label htmlFor="cost-manual" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
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
                                        <label htmlFor="cost-auto" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
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
                                                    className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-gray-50"
                                                    placeholder="Cost"
                                                    value={cost || ""}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {assignError && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                        <p className="text-sm font-medium text-red-800">{assignError}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={assignLoading}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                        assignLoading 
                                            ? "bg-purple-500 cursor-not-allowed" 
                                            : "bg-purple-400 hover:bg-purple-500"
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                >
                                    {assignLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Assign Locker
                                        </>
                                    )}
                        </button>
                    </form>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default AvailableLockers;
