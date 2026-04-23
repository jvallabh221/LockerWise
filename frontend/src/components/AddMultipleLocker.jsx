import React, { useState, useContext } from "react";
import { LockerContext } from "../context/LockerProvider";
import axios from "axios";
import Layout from "./Layout";
import { Upload, FileSpreadsheet, Download, Loader } from "lucide-react";
import {
    PageShell,
    FormCard,
    ErrorBanner,
    SuccessBanner,
    FormActions,
} from "./ui/FormShell";

const AddMultipleLocker = () => {
    const { setAddMulSuccess, fetchAndCategorizeLockers } = useContext(LockerContext);
    const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleFileUpload = async () => {
        if (!file) return setError("Please select a file to upload.");

        setLoading(true);
        setSuccess("");
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/upload-excel`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (response.status === 201) {
                const msg = response.data.message || "File processed. Lockers added.";
                setSuccess(msg);
                setAddMulSuccess(true);
                setFile(null);
                if (fetchAndCategorizeLockers) await fetchAndCategorizeLockers();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error uploading file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Inventory / Bulk"
                title="Bulk import"
                italicTitle="lockers."
                description="Upload a spreadsheet to add multiple lockers at once. Download the template to get started."
            >
                <FormCard num="01 / Template" title="Start from the template">
                    <p className="text-slate-600 mb-6 max-w-xl">
                        The template defines the expected columns. Fill in one row per locker, save as .xlsx, and upload below.
                    </p>
                    <a
                        href="/multipleLockersTemplate.xlsx"
                        download="Lockers.xlsx"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-ink-900 text-ink-900 font-mono text-xs uppercase tracking-editorial hover:bg-ink-900 hover:text-cream-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download template
                    </a>
                </FormCard>

                <FormCard num="02 / Upload" title="Upload your file">
                    <label className="block border border-dashed border-ink-900/25 bg-cream-50 p-8 text-center cursor-pointer hover:border-brass-400 transition-colors">
                        <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-500 mb-3" />
                        <div className="lw-eyebrow mb-1">Excel file</div>
                        <p className="text-sm text-slate-600">
                            {file ? (
                                <span className="font-mono text-ink-900">{file.name}</span>
                            ) : (
                                <>Click to choose a .xlsx or .xls file</>
                            )}
                        </p>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />
                    </label>

                    <ErrorBanner>{error}</ErrorBanner>
                    <SuccessBanner>{success}</SuccessBanner>

                    <FormActions>
                        <button
                            onClick={handleFileUpload}
                            disabled={loading || !file}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading</> : <><Upload className="w-4 h-4" /> Upload file</>}
                        </button>
                    </FormActions>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default AddMultipleLocker;
