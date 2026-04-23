import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminProvider";
import { LockerContext } from "../context/LockerProvider";
import { Loader, Trash2 } from "lucide-react";
import Layout from "./Layout";
import {
    PageShell,
    FormCard,
    FieldRow,
    FieldGrid,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

const DeleteLocker = () => {
    const { deleteLocker } = useContext(AdminContext);
    const { fetchAndCategorizeLockers } = useContext(LockerContext);
    const [lockerNumber, setLockerNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!/^\d*\.?\d*$/.test(lockerNumber))
            return setError("Locker number must be a positive number.");

        setLoading(true);
        try {
            await deleteLocker(lockerNumber);
            if (fetchAndCategorizeLockers) await fetchAndCategorizeLockers();
        } catch (err) {
            setError(err.message || "Failed to delete locker.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Inventory / Delete"
                title="Delete a"
                italicTitle="locker."
                description="Permanently remove a locker entry. This action cannot be undone."
            >
                <FormCard>
                    <form onSubmit={handleSubmit}>
                        <FieldGrid cols={1}>
                            <FieldRow label="Locker number" htmlFor="locker_number">
                                <input
                                    id="locker_number"
                                    type="text"
                                    required
                                    placeholder="e.g. 1042"
                                    value={lockerNumber}
                                    onChange={(e) => setLockerNumber(e.target.value)}
                                    className="lw-input"
                                />
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-error-500 hover:bg-error-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                            >
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Deleting</> : <><Trash2 className="w-4 h-4" /> Delete locker</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default DeleteLocker;
