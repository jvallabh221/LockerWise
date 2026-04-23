import React, { useContext, useEffect, useState } from "react";
import { LockerContext } from "../context/LockerProvider";
import { Loader, ArrowRight } from "lucide-react";
import Layout from "./Layout";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    ReadonlyBlock,
    FormActions,
} from "./ui/FormShell";

const AssignLocker = () => {
    const { availableLockers, allocateLocker } = useContext(LockerContext);

    const [months, setMonths] = useState(null);
    const [empName, setEmpName] = useState("");
    const [empId, setEmpId] = useState("");
    const [empEmail, setEmpEmail] = useState("");
    const [empPhone, setEmpPhone] = useState("");
    const [cost, setCost] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!availableLockers?.data) return;
        if (months === "3") setCost(availableLockers.data.LockerPrice3Month);
        else if (months === "6") setCost(availableLockers.data.LockerPrice6Month);
        else if (months === "12") setCost(availableLockers.data.LockerPrice12Month);
        else setCost("");
    }, [months, availableLockers]);

    const data = availableLockers?.data;
    if (!data) {
        return (
            <Layout>
                <PageShell eyebrow="Operations / Assign" title="Assign" italicTitle="locker."
                    description="No locker selected. Start by checking availability.">
                </PageShell>
            </Layout>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!months) return setError("Duration is required.");
        if (months === "customize" && (!startDate || !endDate))
            return setError("Start and end dates are required for custom duration.");
        if (!/^\d*\.?\d*$/.test(cost))
            return setError("Invalid input: Cost must be a positive number.");

        setLoading(true);
        try {
            await allocateLocker(
                data.LockerNumber, data.LockerType, data.LockerCode,
                empName, empId, empEmail, empPhone,
                data.availableForGender, cost, months, startDate, endDate
            );
        } catch {
            setError("Error allocating locker. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Assign"
                title="Assign"
                italicTitle="to employee."
                description="Complete the assignment for the selected locker."
            >
                <FormCard>
                    <ReadonlyBlock
                        title="Locker on file"
                        items={[
                            { label: "Locker #", value: data.LockerNumber },
                            { label: "Code", value: data.LockerCode },
                            { label: "Serial", value: data.LockerSerialNumber },
                            { label: "Type", value: data.LockerType },
                            { label: "Gender", value: data.availableForGender },
                        ]}
                    />

                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="lw-eyebrow mb-4">User</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Name" htmlFor="name">
                                <input id="name" type="text" required className="lw-input"
                                    value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="Full name" />
                            </FieldRow>
                            <FieldRow label="Employee ID" htmlFor="Id">
                                <input id="Id" type="text" required className="lw-input"
                                    value={empId} onChange={(e) => setEmpId(e.target.value)} placeholder="ID" />
                            </FieldRow>
                            <FieldRow label="Email" htmlFor="email">
                                <input id="email" type="email" required className="lw-input"
                                    value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} placeholder="name@organization.com" autoComplete="off" />
                            </FieldRow>
                            <FieldRow label="Phone" htmlFor="Phone">
                                <input id="Phone" type="text" required className="lw-input"
                                    value={empPhone} onChange={(e) => setEmpPhone(e.target.value)} placeholder="+1 ..." />
                            </FieldRow>
                        </FieldGrid>

                        <div className="lw-rule my-8" />
                        <div className="lw-eyebrow mb-4">Term</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Duration" htmlFor="duration" span={months === "customize" ? 2 : 1}>
                                <select id="duration" className="lw-input"
                                    value={months || ""} onChange={(e) => setMonths(e.target.value)}>
                                    <option value="" disabled>Select duration</option>
                                    <option value="3">3 months</option>
                                    <option value="6">6 months</option>
                                    <option value="12">12 months</option>
                                    <option value="customize">Customize</option>
                                </select>
                            </FieldRow>
                            {months === "customize" ? (
                                <>
                                    <FieldRow label="Start date" htmlFor="startDate">
                                        <input id="startDate" type="date" required className="lw-input"
                                            value={startDate ? startDate.split("T")[0] : ""}
                                            onChange={(e) => {
                                                const sel = new Date(e.target.value);
                                                const now = new Date();
                                                sel.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                                                setStartDate(sel.toISOString());
                                            }}
                                            min={new Date().toISOString().split("T")[0]} />
                                    </FieldRow>
                                    <FieldRow label="End date" htmlFor="endDate">
                                        <input id="endDate" type="date" required className="lw-input"
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
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60">
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Assigning</> : <>Assign <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default AssignLocker;
