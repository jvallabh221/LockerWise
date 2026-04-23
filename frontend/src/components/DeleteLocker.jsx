import React, { useState, useContext, lazy } from "react";
import { AdminContext } from "../context/AdminProvider";
import { LockerContext } from "../context/LockerProvider";
import { Hash, Loader, Trash2, AlertTriangle } from "lucide-react";
import Layout from "./Layout";


const DeleteLocker = () => {
    const { deleteLocker } = useContext(AdminContext);
    const { fetchAndCategorizeLockers } = useContext(LockerContext);
    const [lockerNumber, setLockerNumber] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            await deleteLocker(lockerNumber);
            // Refresh locker data after successful deletion
            if (fetchAndCategorizeLockers) {
                await fetchAndCategorizeLockers();
            }
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
                        <div className="bg-red-100 p-4 rounded-full">
                            <Trash2 className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Delete a Locker
                        </h1>
                        <p className="text-sm text-gray-600">
                            Remove this locker entry to deactivate it and clear its assignment.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center">
                            <label htmlFor="locker_number" className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Locker Number
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Hash className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="locker_number"
                                        name="locker_number"
                                        type="text"
                                        required
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm"
                                        placeholder="Enter the locker number"
                                        value={lockerNumber || ""}
                                        onChange={(e) => setLockerNumber(e.target.value)}
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
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    Delete the Locker
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default DeleteLocker;
