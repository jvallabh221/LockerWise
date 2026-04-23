import React, { useState, useContext, useEffect } from "react";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { Search, Loader, UserPlus } from "lucide-react";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    ReadonlyBlock,
    FormActions,
} from "./ui/FormShell";

const AvailableLockers = () => {
    const { availableLocker, availableLockers, setAvailableLockers, allocateLocker } = useContext(LockerContext);

    const [lockerType, setLockerType] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const [availableError, setAvailableError] = useState("");

    const [months, setMonths] = useState(null);
    const [empName, setEmpName] = useState(null);
    const [empId, setEmpId] = useState(null);
    const [empEmail, setEmpEmail] = useState(null);
    const [empPhone, setEmpPhone] = useState(null);
    const [cost, setCost] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignError, setAssignError] = useState("");

    useEffect(() => {
        if (availableLockers) {
            setAvailableLockers(null);
            setMonths(null);
            setEmpName(null);
            setEmpId(null);
            setEmpEmail(null);
            setEmpPhone(null);
            setCost(null);
            setStartDate(null);
            setEndDate(null);
            setAssignError("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockerType, gender]);

    useEffect(() => {
        if (months === "3" && availableLockers?.data) setCost(availableLockers.data.LockerPrice3Month);
        else if (months === "6" && availableLockers?.data) setCost(availableLockers.data.LockerPrice6Month);
        else if (months === "12" && availableLockers?.data) setCost(availableLockers.data.LockerPrice12Month);
        else setCost("");
    }, [months, availableLockers]);

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setAvailableError("");
        setLoading(true);
        try {
            await availableLocker(lockerType, gender);
        } catch (error) {
            setAvailableError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignLocker = async (e) => {
        e.preventDefault();
        setAssignError("");
        if (!months) return setAssignError("Duration is required.");
        if (months === "customize" && (!startDate || !endDate))
            return setAssignError("Start and end dates are required for custom duration.");
        if (!/^\d*\.?\d*$/.test(cost))
            return setAssignError("Invalid input: Cost must be a positive number.");

        setAssignLoading(true);
        try {
            await allocateLocker(
                availableLockers.data.LockerNumber,
                availableLockers.data.LockerType,
                availableLockers.data.LockerCode,
                empName,
                empId,
                empEmail,
                empPhone,
                availableLockers.data.availableForGender,
                cost,
                months,
                startDate,
                endDate
            );
        } catch {
            setAssignError("Error allocating locker. Please try again.");
        } finally {
            setAssignLoading(false);
        }
    };

    const data = availableLockers?.data;

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Assign"
                title="Assign a"
                italicTitle="locker."
                description="Find an available locker by type and gender, then complete the assignment below."
            >
                {/* Step 1 — availability */}
                <FormCard num="01 / Availability" title="Check availability">
                    <form onSubmit={handleCheckAvailability}>
                        <FieldGrid cols={2}>
                            <FieldRow label="Locker type" htmlFor="lockerType">
                                <select
                                    id="lockerType"
                                    value={lockerType}
                                    onChange={(e) => setLockerType(e.target.value)}
                                    required
                                    className="lw-input"
                                >
                                    <option value="" disabled>Select type</option>
                                    <option value="half">Half</option>
                                    <option value="full">Full</option>
                                </select>
                            </FieldRow>
                            <FieldRow label="Gender" htmlFor="gender">
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    className="lw-input"
                                >
                                    <option value="" disabled>Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{availableError}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Checking
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Check availability
                                    </>
                                )}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>

                {/* Step 2 — assignment */}
                {data && (
                    <FormCard num="02 / Assignment" title="Assign to user">
                        <ReadonlyBlock
                            title="Locker on file"
                            items={[
                                { label: "Locker #", value: data.LockerNumber },
                                { label: "Code", value: data.LockerCode },
                                { label: "Type", value: data.LockerType },
                                { label: "Serial", value: data.LockerSerialNumber },
                                { label: "Gender", value: data.availableForGender },
                            ]}
                        />

                        <form onSubmit={handleAssignLocker} className="mt-8">
                            <div className="lw-eyebrow mb-4">User details</div>
                            <FieldGrid cols={2}>
                                <FieldRow label="Name" htmlFor="name">
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        placeholder="Full name"
                                        value={empName || ""}
                                        onChange={(e) => setEmpName(e.target.value)}
                                        className="lw-input"
                                    />
                                </FieldRow>
                                <FieldRow label="Employee ID" htmlFor="Id">
                                    <input
                                        id="Id"
                                        type="text"
                                        required
                                        placeholder="ID"
                                        value={empId || ""}
                                        onChange={(e) => setEmpId(e.target.value)}
                                        className="lw-input"
                                    />
                                </FieldRow>
                                <FieldRow label="Email" htmlFor="email">
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="name@organization.com"
                                        value={empEmail || ""}
                                        onChange={(e) => setEmpEmail(e.target.value)}
                                        autoComplete="off"
                                        className="lw-input"
                                    />
                                </FieldRow>
                                <FieldRow label="Phone" htmlFor="Phone">
                                    <input
                                        id="Phone"
                                        type="text"
                                        required
                                        placeholder="+1 ..."
                                        value={empPhone || ""}
                                        onChange={(e) => setEmpPhone(e.target.value)}
                                        className="lw-input"
                                    />
                                </FieldRow>
                            </FieldGrid>

                            <div className="lw-rule my-8" />
                            <div className="lw-eyebrow mb-4">Term & cost</div>
                            <FieldGrid cols={2}>
                                <FieldRow label="Duration" htmlFor="duration" span={months === "customize" ? 2 : 1}>
                                    <select
                                        id="duration"
                                        value={months || ""}
                                        onChange={(e) => setMonths(e.target.value)}
                                        className="lw-input"
                                    >
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
                                            <input
                                                id="startDate"
                                                type="date"
                                                required
                                                value={startDate ? startDate.split("T")[0] : ""}
                                                onChange={(e) => {
                                                    const sel = new Date(e.target.value);
                                                    const now = new Date();
                                                    sel.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                                                    setStartDate(sel.toISOString());
                                                }}
                                                min={new Date().toISOString().split("T")[0]}
                                                className="lw-input"
                                            />
                                        </FieldRow>
                                        <FieldRow label="End date" htmlFor="endDate">
                                            <input
                                                id="endDate"
                                                type="date"
                                                required
                                                value={endDate ? endDate.split("T")[0] : ""}
                                                onChange={(e) => {
                                                    const sel = new Date(e.target.value);
                                                    sel.setHours(23, 59, 59, 999);
                                                    setEndDate(sel.toISOString());
                                                }}
                                                min={startDate ? startDate.split("T")[0] : ""}
                                                className="lw-input"
                                            />
                                        </FieldRow>
                                    </>
                                ) : null}

                                <FieldRow label="Cost (USD)" htmlFor="cost" span={2}>
                                    <input
                                        id="cost"
                                        type="text"
                                        required
                                        placeholder={months === "customize" ? "Enter cost" : "Auto-calculated"}
                                        value={cost || ""}
                                        onChange={(e) => setCost(e.target.value)}
                                        readOnly={months !== "customize"}
                                        className="lw-input"
                                    />
                                </FieldRow>
                            </FieldGrid>

                            <ErrorBanner>{assignError}</ErrorBanner>

                            <FormActions>
                                <button
                                    type="submit"
                                    disabled={assignLoading}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                                >
                                    {assignLoading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Assigning
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Assign locker
                                        </>
                                    )}
                                </button>
                            </FormActions>
                        </form>
                    </FormCard>
                )}
            </PageShell>
        </Layout>
    );
};

export default AvailableLockers;
