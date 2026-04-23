import React, { useState, lazy, useContext } from "react";
import { LockerContext } from "../context/LockerProvider";
import axios from "axios";
import Layout from "./Layout";
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, Loader } from "lucide-react";


const AddMultipleLocker = () => {
    const { setAddMulSuccess, fetchAndCategorizeLockers } = useContext(LockerContext);

    const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));

    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file to upload.");
            setIsSuccess(false);
            return;
        }

        setLoading(true);
        setIsSuccess(false);
        setUploadStatus("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/upload-excel`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (response.status === 201) {
                const message = response.data.message || "File processed and lockers added successfully";
                setUploadStatus(message);
                setIsSuccess(true);
                setAddMulSuccess(true);
                setFile(null);
                // Refresh locker data after successful upload
                if (fetchAndCategorizeLockers) {
                    await fetchAndCategorizeLockers();
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error uploading file. Please try again.";
            setUploadStatus(errorMessage);
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <FileSpreadsheet className="w-12 h-12 text-gray-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Add Multiple Lockers
                        </h1>
                        <p className="text-sm text-gray-600">Upload an Excel file to add multiple lockers at once</p>
                    </div>

                    {/* Download Template */}
                    <div className="mb-6">
                        <a 
                            href="/multipleLockersTemplate.xlsx" 
                            download="Lockers.xlsx" 
                            className="flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
                        >
                            <Download className="w-5 h-5" />
                            Download Template
                        </a>
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className="text-sm font-semibold text-gray-700 w-24 flex-shrink-0">
                                Select Excel File
                            </label>
                            <div className="relative flex-1">
                                <input
                                    type="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    accept=".xlsx, .xls"
                                    className="block w-full text-sm text-gray-700 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 file:bg-gray-400 file:text-black file:font-medium file:border-none file:px-4 file:py-2 file:rounded-l-lg file:mr-4 hover:file:bg-gray-500 transition-colors"
                                />
                                {file && (
                                    <div className="mt-2 flex items-center text-sm text-gray-600">
                                        <FileSpreadsheet className="w-4 h-4" />
                                        <span className="font-medium">{file.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleFileUpload}
                            disabled={loading || !file}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                loading || !file
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 hover:bg-gray-700"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload the File
                                </>
                            )}
                        </button>
                    </div>

                    {/* Upload Status */}
                    {uploadStatus && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center ${
                            isSuccess 
                                ? "bg-green-50 border border-green-200" 
                                : "bg-red-50 border border-red-200"
                        }`}>
                            {isSuccess ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <p className={`text-sm font-medium ${
                                isSuccess ? "text-green-800" : "text-red-800"
                            }`}>
                                {uploadStatus}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default AddMultipleLocker;
