import React, { useState, lazy, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import { Loader, Hash, RotateCcw, Mail, AlertTriangle } from "lucide-react";
import { LockerContext } from "../context/LockerProvider";

const getCancelLockerErrorMessage = (backendMessage) => {
    return backendMessage || "No locker matched.";
};

const UpdateLockerFeature = () => {
    const { cancelLocker, setCancelSuccess } = useContext(LockerContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { LockerNumber, employeeEmail } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");        

        if (!/^\d*\.?\d*$/.test(LockerNumber)) {
            setError("Invalid input: Locker Number must be a positive number.");
            return;
        }

        setLoading(true);

        try {
            const result = await cancelLocker(LockerNumber, employeeEmail);
            if (result && result.data) {
                const nextCode = result.data.LockerCode || "";
                toast.success(`Locker reset successfully. Next combination: ${nextCode}`, { autoClose: 5000 });
                setCancelSuccess(false);
                setTimeout(() => navigate("/dashboard"), 5000);
            } else {
                setError(getCancelLockerErrorMessage(null));
            }
        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(getCancelLockerErrorMessage(backendMessage));
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
                            Reset the Current Locker
                        </h1>
                        <p className="text-sm text-gray-600">
                            Reset the locker combination for the selected locker
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <label htmlFor="number" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
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
                                        placeholder="Enter the locker number"
                                        value={LockerNumber || ""}
                                        readOnly
                                    />
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
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                loading 
                                    ? "bg-orange-500 cursor-not-allowed" 
                                    : "bg-orange-600 hover:bg-orange-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="w-5 h-5" />
                                    Reset Locker
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </Layout>
    );
};

export default UpdateLockerFeature;
