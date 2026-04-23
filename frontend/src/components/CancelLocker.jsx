import { useState, useContext } from "react";
import { Hash, Mail, Loader, AlertTriangle, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const getCancelLockerErrorMessage = (backendMessage) => {
    return backendMessage || "No locker matched.";
};


const CancelLocker = () => {
    const { cancelLocker, setCancelSuccess } = useContext(LockerContext);
    const navigate = useNavigate();

    const [lockerEmail, setLockerEmail] = useState("");
    const [lockerNumber, setLockerNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [error, setError] = useState("");

    const handleLockerEmail = (e) => {
        setLockerEmail(e.target.value);
    };

    const handleLockerNumber = (e) => {
        setLockerNumber(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!/^[0-9]+$/.test(lockerNumber)) {
            setError("Locker Number must be a positive number.");
            return;
        }

        // Show confirmation dialog instead of immediately canceling
        setShowConfirmDialog(true);
    };

    const handleConfirmCancel = async () => {
        setShowConfirmDialog(false);
        setError("");
        setLoading(true);
        
        try {
            const data = await cancelLocker(lockerNumber, lockerEmail);
            if (data && data.data) {
                toast.success(`Locker taken back successfully. Next combination: ${data.data.LockerCode}`, { autoClose: 5000 });
                setCancelSuccess(false);
                setTimeout(() => navigate("/dashboard"), 5000);
            } else {
                setError(getCancelLockerErrorMessage(null));
            }
        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(getCancelLockerErrorMessage(backendMessage));
            toast.error(getCancelLockerErrorMessage(backendMessage), {
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDialog = () => {
        setShowConfirmDialog(false);
    };

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                        
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Cancel Locker Assignment
                        </h1>
                        <p className="text-sm text-gray-600">
                            Cancel a locker assignment by providing the email and locker number
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
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Enter the locker email"
                                        value={lockerEmail}
                                        onChange={handleLockerEmail}
                                        autoComplete="off"
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
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Enter the locker number"
                                        value={lockerNumber}
                                        onChange={handleLockerNumber}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || showConfirmDialog}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                loading || showConfirmDialog
                                    ? "bg-red-500 cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    Cancel Locker
                                </>
                            )}
                        </button>
                    </form>

                    {/* Confirmation Dialog */}
                    {showConfirmDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Confirm Cancellation
                                    </h2>
                                </div>
                                
                                <p className="text-gray-700 mb-2">
                                    Are you sure you want to cancel the locker assignment?
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                                    <p className="text-sm text-gray-600">
                                        <strong>Locker Number:</strong> {lockerNumber}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Email:</strong> {lockerEmail}
                                    </p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelDialog}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmCancel}
                                        disabled={loading}
                                        className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                                            loading
                                                ? "bg-red-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                        } focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : (
                                            "Confirm"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </Layout>
    );
};

export default CancelLocker;
