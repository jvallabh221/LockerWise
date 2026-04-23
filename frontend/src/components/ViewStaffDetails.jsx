import React, { useState, useContext } from "react";
import Layout from "./Layout";
import { AdminContext } from "../context/AdminProvider";
import { Loader, Trash2, AlertTriangle } from "lucide-react";
import {
    PageShell,
    FormCard,
    ReadonlyBlock,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

const ViewStaffDetails = () => {
    const { staffDetails, deleteStaff } = useContext(AdminContext);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const details = staffDetails?.user;
    if (!details) {
        return (
            <Layout>
                <PageShell eyebrow="Directory / Staff" title="No staff" italicTitle="selected."
                    description="Select a staff member from the directory to view details." />
            </Layout>
        );
    }

    const handleConfirm = async () => {
        setShowConfirm(false);
        setLoading(true);
        setErr("");
        try {
            await deleteStaff(details._id);
        } catch (error) {
            setErr(error.message || "Failed to remove staff.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow={`Directory / ${details.role || "Staff"}`}
                title="Remove"
                italicTitle="a staff member."
                description="Review the record, then confirm removal."
            >
                <FormCard>
                    <ReadonlyBlock
                        title="Record on file"
                        items={[
                            { label: "Name", value: details.name },
                            { label: "Role", value: details.role },
                            { label: "Gender", value: details.gender },
                            { label: "Email", value: details.email },
                        ]}
                    />

                    <ErrorBanner>{err}</ErrorBanner>

                    <FormActions>
                        <button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-error-500 hover:bg-error-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                        >
                            {loading ? <><Loader className="w-4 h-4 animate-spin" /> Removing</> : <><Trash2 className="w-4 h-4" /> Remove staff</>}
                        </button>
                    </FormActions>
                </FormCard>

                {showConfirm && (
                    <div className="fixed inset-0 bg-ink-900/70 flex items-center justify-center z-50 px-4">
                        <div className="bg-white border border-ink-900/10 max-w-md w-full p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-error-500 text-white rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h2 className="font-display text-2xl text-ink-900">Confirm removal</h2>
                            </div>
                            <p className="text-slate-600 mb-6">
                                This will permanently remove <strong>{details.name}</strong> from the directory.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 px-4 py-2.5 border border-ink-100 text-ink-900 bg-white font-medium text-sm rounded-md hover:bg-cream-200 hover:border-ink-200 transition-colors"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 px-4 py-2.5 bg-error-500 hover:bg-error-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PageShell>
        </Layout>
    );
};

export default ViewStaffDetails;
