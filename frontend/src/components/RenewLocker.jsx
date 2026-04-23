import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { Loader, RefreshCw } from "lucide-react";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    ReadonlyBlock,
    FormActions,
} from "./ui/FormShell";

const RenewLocker = () => {
    const location = useLocation();
    const [cost, setCost] = useState("");
    const [months, setMonths] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { handleRenewLocker } = useContext(LockerContext);

    const {
        LockerNumber,
        employeeName,
        LockerPrice3Month,
        LockerPrice6Month,
        LockerPrice12Month,
        employeeEmail,
    } = location.state || {};

    useEffect(() => {
        if (months === "3") setCost(LockerPrice3Month);
        else if (months === "6") setCost(LockerPrice6Month);
        else if (months === "12") setCost(LockerPrice12Month);
        else setCost("");
    }, [months, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!months) return setError("Duration is required.");
        if (months === "customize" && (!startDate || !endDate))
            return setError("Start and end dates are required for custom duration.");
        if (!/^\d*\.?\d*$/.test(cost))
            return setError("Invalid input: Price must be a positive number.");

        setLoading(true);
        try {
            await handleRenewLocker(LockerNumber, cost, months, startDate, endDate, employeeEmail);
        } catch (err) {
            setError(err.response?.data?.message || "No locker matched.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Renew"
                title="Renew"
                italicTitle="subscription."
                description="Extend the assignment for an existing locker."
            >
                <FormCard>
                    <ReadonlyBlock
                        title="Current assignment"
                        items={[
                            { label: "Locker #", value: LockerNumber },
                            { label: "Name", value: employeeName },
                            { label: "Email", value: employeeEmail },
                        ]}
                    />

                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="lw-eyebrow mb-4">New term</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Duration" htmlFor="duration" span={months === "customize" ? 2 : 1}>
                                <select id="duration" className="lw-input"
                                    value={months} onChange={(e) => setMonths(e.target.value)}>
                                    <option value="" disabled>Select duration</option>
                                    <option value="3">3 months</option>
                                    <option value="6">6 months</option>
                                    <option value="12">12 months</option>
                                    <option value="customize">Customize</option>
                                </select>
                            </FieldRow>

                            {months === "customize" ? (
                                <>
                                    <FieldRow label="Start date" htmlFor="start-date">
                                        <input id="start-date" type="date" required className="lw-input"
                                            value={startDate ? startDate.split("T")[0] : ""}
                                            onChange={(e) => {
                                                const sel = new Date(e.target.value);
                                                const now = new Date();
                                                sel.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                                                setStartDate(sel.toISOString());
                                            }}
                                            min={new Date().toISOString().split("T")[0]} />
                                    </FieldRow>
                                    <FieldRow label="End date" htmlFor="end-date">
                                        <input id="end-date" type="date" required className="lw-input"
                                            value={endDate ? endDate.split("T")[0] : ""}
                                            onChange={(e) => {
                                                const sel = new Date(e.target.value);
                                                sel.setHours(23, 59, 59, 999);
                                                setEndDate(sel.toISOString());
                                            }}
                                            min={startDate ? startDate.split("T")[0] : ""} />
                                    </FieldRow>
                                </>
                            ) : null}

                            <FieldRow label="Cost (USD)" htmlFor="cost" span={2}>
                                <input id="cost" type="text" required className="lw-input"
                                    value={cost || ""} onChange={(e) => setCost(e.target.value)}
                                    readOnly={months !== "customize"} placeholder="Cost" />
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button type="submit" disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60">
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Renewing</> : <><RefreshCw className="w-4 h-4" /> Renew locker</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default RenewLocker;
