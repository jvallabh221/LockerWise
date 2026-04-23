import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import { Loader, RotateCcw } from "lucide-react";
import { LockerContext } from "../context/LockerProvider";
import {
    PageShell,
    FormCard,
    ReadonlyBlock,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

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
        if (!/^\d*\.?\d*$/.test(LockerNumber))
            return setError("Locker number must be a positive number.");
        setLoading(true);
        try {
            const result = await cancelLocker(LockerNumber, employeeEmail);
            if (result && result.data) {
                const nextCode = result.data.LockerCode || "";
                toast.success(`Locker reset. Next combination: ${nextCode}`, { autoClose: 5000 });
                setCancelSuccess(false);
                setTimeout(() => navigate("/dashboard"), 5000);
            } else {
                setError("No locker matched.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "No locker matched.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Reset"
                title="Reset"
                italicTitle="locker combination."
                description="Return this locker to the pool and generate a new combination for future assignment."
            >
                <FormCard>
                    <ReadonlyBlock
                        title="Subject locker"
                        items={[
                            { label: "Locker #", value: LockerNumber },
                            { label: "Email", value: employeeEmail },
                        ]}
                    />

                    <form onSubmit={handleSubmit} className="mt-8">
                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-error-500 hover:bg-error-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                            >
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Resetting</> : <><RotateCcw className="w-4 h-4" /> Reset locker</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </Layout>
    );
};

export default UpdateLockerFeature;
