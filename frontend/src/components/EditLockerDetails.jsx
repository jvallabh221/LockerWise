import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { RefreshCcw, Loader, Save } from "lucide-react";
import Layout from "./Layout";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

export default function EditLockerDetails() {
    const lockerData = useLocation();
    const { handleEditLockerDetails } = useContext(LockerContext);
    const [lockerDetails, setLockerDetails] = useState(lockerData.state || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (attr, value) => {
        if (typeof attr !== "string" || !attr) return setError("Invalid attribute.");
        if (value === undefined || value === null) return setError("Invalid value.");
        setLockerDetails((old) => ({ ...old, [attr]: value }));
    };

    const getRandomLockerCode = (combinations) => {
        if (!combinations || combinations.length === 0) {
            setError("No locker code combinations available.");
            return null;
        }
        return combinations[Math.floor(Math.random() * combinations.length)];
    };

    const changePin = () => {
        const next = getRandomLockerCode(lockerDetails.LockerCodeCombinations);
        if (next) handleChange("LockerCode", next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await handleEditLockerDetails(
                lockerDetails.LockerNumber,
                lockerDetails.employeeName,
                lockerDetails.employeePhone,
                lockerDetails.employeeId,
                lockerDetails.LockerCode
            );
        } catch (err) {
            setError(err.message || "Failed to update.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow={`Record / Locker #${lockerDetails.LockerNumber || "—"}`}
                title="Edit"
                italicTitle="locker details."
                description="Update assignment details and rotate the locker combination if needed."
            >
                <FormCard>
                    <form onSubmit={handleSubmit}>
                        <div className="lw-eyebrow mb-4">Assignment</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Employee name" htmlFor="employeeName">
                                <input
                                    id="employeeName"
                                    disabled={loading}
                                    className="lw-input"
                                    value={lockerDetails.employeeName || ""}
                                    onChange={(e) => handleChange("employeeName", e.target.value)}
                                    placeholder="Full name"
                                />
                            </FieldRow>
                            <FieldRow label="Phone" htmlFor="employeePhone">
                                <input
                                    id="employeePhone"
                                    disabled={loading}
                                    className="lw-input"
                                    value={lockerDetails.employeePhone || ""}
                                    onChange={(e) => handleChange("employeePhone", e.target.value)}
                                    placeholder="+1 ..."
                                />
                            </FieldRow>
                            <FieldRow label="Employee ID" htmlFor="employeeId">
                                <input
                                    id="employeeId"
                                    disabled={loading}
                                    className="lw-input"
                                    value={lockerDetails.employeeId || ""}
                                    onChange={(e) => handleChange("employeeId", e.target.value)}
                                    placeholder="ID"
                                />
                            </FieldRow>
                            <FieldRow label="Locker combination" htmlFor="LockerCode">
                                <div className="flex items-end gap-2">
                                    <input
                                        id="LockerCode"
                                        readOnly
                                        className="lw-input font-mono flex-1"
                                        value={lockerDetails.LockerCode || ""}
                                    />
                                    <button
                                        type="button"
                                        onClick={changePin}
                                        disabled={loading}
                                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 border border-ink-100 text-slate-600 bg-white text-xs font-medium rounded-md hover:bg-cream-200 hover:text-ink-900 hover:border-ink-200 transition-colors"
                                        title="Rotate"
                                    >
                                        <RefreshCcw className="w-3.5 h-3.5" />
                                        Rotate
                                    </button>
                                </div>
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                            >
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Updating</> : <><Save className="w-4 h-4" /> Save changes</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
}
