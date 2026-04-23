import React, { useState, useContext } from "react";
import { Loader, Trash2, AlertTriangle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

const CancelLocker = () => {
    const { cancelLocker, setCancelSuccess } = useContext(LockerContext);
    const navigate = useNavigate();

    const [lockerEmail, setLockerEmail] = useState("");
    const [lockerNumber, setLockerNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!/^[0-9]+$/.test(lockerNumber)) {
            return setError("Locker number must be a positive number.");
        }
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        setError("");
        setLoading(true);
        try {
            const data = await cancelLocker(lockerNumber, lockerEmail);
            if (data && data.data) {
                toast.success(`Locker taken back. Next combination: ${data.data.LockerCode}`, { autoClose: 5000 });
                setCancelSuccess(false);
                setTimeout(() => navigate("/dashboard"), 5000);
            } else {
                setError("No locker matched.");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "No locker matched.";
            setError(msg);
            toast.error(msg, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Cancel"
                title="Cancel an"
                italicTitle="assignment."
                description="Return an assigned locker to the pool. A new combination will be generated automatically."
            >
                <FormCard>
                    <form onSubmit={handleSubmit}>
                        <div className="lw-eyebrow mb-4">Look up by</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Email" htmlFor="email">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="lw-input"
                                    placeholder="name@organization.com"
                                    value={lockerEmail}
                                    onChange={(e) => setLockerEmail(e.target.value)}
                                    autoComplete="off"
                                />
                            </FieldRow>
                            <FieldRow label="Locker number" htmlFor="number">
                                <input
                                    id="number"
                                    type="text"
                                    required
                                    className="lw-input"
                                    placeholder="e.g. 1042"
                                    value={lockerNumber}
                                    onChange={(e) => setLockerNumber(e.target.value)}
                                />
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading || showConfirm}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7a2a18] text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-[#5e1f0f] transition-colors disabled:opacity-60"
                            >
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Cancelling</> : <><Trash2 className="w-4 h-4" /> Cancel assignment</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>

                {showConfirm && (
                    <div className="fixed inset-0 bg-ink-900/70 flex items-center justify-center z-50 px-4">
                        <div className="bg-white border border-ink-900/10 max-w-md w-full p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#7a2a18] text-cream-50 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h2 className="font-display text-2xl text-ink-900">Confirm cancellation</h2>
                            </div>
                            <p className="text-slate-600 mb-4">
                                This will return the locker to the pool and generate a new combination. This cannot be undone.
                            </p>
                            <div className="border border-ink-900/10 bg-cream-50 p-4 mb-6">
                                <dl className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <dt className="lw-label !mb-0">Locker</dt>
                                        <dd className="font-mono text-ink-900">#{lockerNumber}</dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <dt className="lw-label !mb-0">Email</dt>
                                        <dd className="font-mono text-ink-900 truncate">{lockerEmail}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 border border-ink-900 text-ink-900 font-mono text-xs uppercase tracking-editorial hover:bg-ink-900 hover:text-cream-50 transition-colors"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7a2a18] text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-[#5e1f0f] transition-colors disabled:opacity-60"
                                >
                                    {loading ? <><Loader className="w-4 h-4 animate-spin" /> Working</> : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PageShell>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </Layout>
    );
};

export default CancelLocker;
