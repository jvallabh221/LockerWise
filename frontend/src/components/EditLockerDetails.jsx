import { IdCard, KeyRound, RefreshCcw, User, Hash, Mail, Phone, Loader, Save, AlertTriangle, Edit } from "lucide-react";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";

export default function EditLockerDetails() {
    const lockerData = useLocation();
    const {handleEditLockerDetails} = useContext(LockerContext)
    const [lockerDetails, setLockerDetails] = useState(lockerData.state);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");

    function changePin() {
        const newCode = getRandomLockerCode(lockerDetails.LockerCodeCombinations);
        if (newCode) {
            handleChange("LockerCode", newCode);
        } else {
            //console.error("Failed to change pin: No valid combinations available.");
            setError("Failed to change pin: No valid combinations available.");
        }
    }
    
    function getRandomLockerCode(combinations) {
        if (!combinations || combinations.length === 0) {
            //console.error("No locker code combinations available.");
            setError("No locker code combinations available.");
            return null;
        }
        const randomIndex = Math.floor(Math.random() * combinations.length);
        return combinations[randomIndex];
    }
    
    function handleChange(attribute, value) {
        if (typeof attribute !== "string" || !attribute) {
            //console.error("Invalid attribute provided for change.");
            setError("Invalid attribute provided for change.");
            return;
        }
        if (value === undefined || value === null) {
            //console.error("Invalid value provided for change.");
            setError("Invalid value provided for change.");
            return;
        }
    
        setLockerDetails((oldLockerDetails) => {
            const newLockerDetails = { ...oldLockerDetails };
            newLockerDetails[attribute] = value;
            return newLockerDetails;
        });
    }    

    async function handleChangeLockerData() {
        setLoading(true);
        setError("");
        try{
            await handleEditLockerDetails(
            lockerDetails.LockerNumber, 
            lockerDetails.employeeName,
            lockerDetails.employeePhone,
            lockerDetails.employeeId,
            lockerDetails.LockerCode
            );
        } catch (error) {
            //console.error(error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                        
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Edit Locker Details
                        </h1>
                        <p className="text-sm text-gray-600">
                            Locker #{lockerDetails.LockerNumber}
                        </p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleChangeLockerData(); }} className="space-y-4">
                        <div className="flex items-center">
                            <label htmlFor="employeeName" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Employee Name
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <User className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="employeeName"
                                        disabled={loading}
                                        value={lockerDetails.employeeName || ""}
                                        onChange={(event) => handleChange("employeeName", event.target.value)}
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Employee Name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="employeePhone" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Phone
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Phone className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="employeePhone"
                                        disabled={loading}
                                        value={lockerDetails.employeePhone || ""}
                                        onChange={(event) => handleChange("employeePhone", event.target.value)}
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="employeeId" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Employee ID
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <IdCard className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="employeeId"
                                        disabled={loading}
                                        value={lockerDetails.employeeId || ""}
                                        onChange={(event) => handleChange("employeeId", event.target.value)}
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Employee ID"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="LockerCode" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Locker Code
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <div className="flex items-center flex-1">
                                        <KeyRound className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="LockerCode"
                                            value={lockerDetails["LockerCode"] || ""}
                                            readOnly
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-gray-50"
                                            placeholder="Locker Code"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={changePin}
                                        disabled={loading}
                                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-black rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        title="Generate new locker code"
                                    >
                                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
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
                                    ? "bg-gray-500 cursor-not-allowed" 
                                    : "bg-gray-400 hover:bg-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Locker Data
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
};