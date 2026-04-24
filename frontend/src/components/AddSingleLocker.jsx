import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { Loader, ArrowRight, X } from "lucide-react";
import Layout from "./Layout";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

const AddSingleLocker = () => {
    const { addLocker, isEditable, lockerPrices, handleInputChange } = useContext(LockerContext);

    const [lockerType, setLockerType] = useState("");
    const [lockerNumber, setLockerNumber] = useState("");
    const [lockerCode, setLockerCode] = useState(["", "", "", "", ""]);
    const [lockerPriceThree, setLockerPriceThree] = useState("");
    const [lockerPriceSix, setLockerPriceSix] = useState("");
    const [lockerPriceYear, setLockerPriceYear] = useState("");
    const [gender, setGender] = useState("");
    const [lockerSerialNumber, setLockerSerialNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPriceModal, setShowPriceModal] = useState(false);

    const handleLockerCode = (index, event) => {
        const next = [...lockerCode];
        next[index] = event.target.value;
        setLockerCode(next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        for (const code of lockerCode) {
            if (!/^\d*\.?\d*$/.test(code)) return setError("Code must be a positive number.");
        }
        if (!/^\d*\.?\d*$/.test(lockerNumber)) return setError("Locker number must be a positive number.");
        if (!/^\d*\.?\d*$/.test(lockerSerialNumber)) return setError("Serial number must be a positive number.");

        setLoading(true);
        try {
            await addLocker(lockerType, lockerNumber, lockerCode, lockerPriceThree, lockerPriceSix, lockerPriceYear, gender, lockerSerialNumber);
        } catch {
            setError("Failed to add the locker. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderPriceRow = (typeKey, label, genderLabel) => (
        <tr className="border-b border-[var(--border)]">
            <td className="px-3 py-2 font-mono text-xs text-[var(--text)]">{genderLabel}</td>
            <td className="px-3 py-2 font-mono text-xs text-[var(--text)]">{label}</td>
            {["threeMonths", "sixMonths", "twelveMonths"].map((d) => (
                <td key={d} className="px-3 py-2">
                    <input
                        type="text"
                        value={lockerPrices[typeKey][d]}
                        readOnly={!isEditable[typeKey]}
                        onChange={(e) => handleInputChange(e, typeKey, d)}
                        className="w-full bg-transparent border-b border-[var(--border-strong)] text-sm font-mono text-[var(--text)] py-1 focus:outline-none focus:border-brass-400"
                    />
                </td>
            ))}
        </tr>
    );

    return (
        <Layout>
            <PageShell
                eyebrow="Inventory / Add"
                title="Add a"
                italicTitle="locker."
                description="Register a single locker with codes, serial, and pricing."
                rightMeta={
                    <button
                        onClick={() => setShowPriceModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-medium text-sm rounded-md hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors"
                    >
                        Standard prices
                    </button>
                }
            >
                {showPriceModal && (
                    <div className="fixed inset-0 bg-ink-900/70 flex items-center justify-center z-50 p-4" onClick={() => setShowPriceModal(false)}>
                        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="lw-eyebrow mb-1">Reference</div>
                                    <h2 className="font-display text-2xl text-[var(--text)]">Standard prices</h2>
                                </div>
                                <button onClick={() => setShowPriceModal(false)} className="text-slate-500 hover:text-[var(--text)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[var(--border-strong)]">
                                            {["Gender", "Type", "3 mo", "6 mo", "12 mo"].map((h) => (
                                                <th key={h} className="px-3 py-2 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderPriceRow("halfMale", "Half", "Male")}
                                        {renderPriceRow("fullMale", "Full", "Male")}
                                        {renderPriceRow("halfFemale", "Half", "Female")}
                                        {renderPriceRow("fullFemale", "Full", "Female")}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <FormCard>
                    <form onSubmit={handleSubmit}>
                        <div className="lw-eyebrow mb-4">01 / Locker</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Type" htmlFor="lockerType">
                                <select id="lockerType" className="lw-input" value={lockerType} onChange={(e) => setLockerType(e.target.value)}>
                                    <option value="" disabled>Select type</option>
                                    <option value="half">Half</option>
                                    <option value="full">Full</option>
                                </select>
                            </FieldRow>
                            <FieldRow label="Gender" htmlFor="gender">
                                <select id="gender" className="lw-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="" disabled>Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </FieldRow>
                            <FieldRow label="Locker number" htmlFor="number">
                                <input id="number" type="text" required className="lw-input"
                                    value={lockerNumber} onChange={(e) => setLockerNumber(e.target.value)} placeholder="e.g. 1042" />
                            </FieldRow>
                            <FieldRow label="Serial number" htmlFor="s-number">
                                <input id="s-number" type="text" required className="lw-input"
                                    value={lockerSerialNumber} onChange={(e) => setLockerSerialNumber(e.target.value)} placeholder="SN" />
                            </FieldRow>
                        </FieldGrid>

                        <div className="lw-rule my-8" />
                        <div className="lw-eyebrow mb-4">02 / Combination</div>
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index}>
                                    <label htmlFor={`code-${index}`} className="lw-label">Code {index + 1}</label>
                                    <input
                                        id={`code-${index}`}
                                        type="text"
                                        required
                                        className="lw-input text-center font-mono"
                                        placeholder="000"
                                        value={lockerCode[index]}
                                        onChange={(e) => handleLockerCode(index, e)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="lw-rule my-8" />
                        <div className="lw-eyebrow mb-4">03 / Pricing (USD)</div>
                        <FieldGrid cols={3}>
                            <FieldRow label="3 months" htmlFor="lockerPriceThree">
                                <input id="lockerPriceThree" type="text" required className="lw-input"
                                    value={lockerPriceThree} onChange={(e) => setLockerPriceThree(e.target.value)} />
                            </FieldRow>
                            <FieldRow label="6 months" htmlFor="lockerPriceSix">
                                <input id="lockerPriceSix" type="text" required className="lw-input"
                                    value={lockerPriceSix} onChange={(e) => setLockerPriceSix(e.target.value)} />
                            </FieldRow>
                            <FieldRow label="12 months" htmlFor="lockerPriceYear">
                                <input id="lockerPriceYear" type="text" required className="lw-input"
                                    value={lockerPriceYear} onChange={(e) => setLockerPriceYear(e.target.value)} />
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions align="between">
                            <p className="text-xs text-slate-500">
                                Need to add many?{" "}
                                <Link to="/add_multiple_locker" className="underline underline-offset-2 hover:text-[var(--text)]">
                                    Bulk upload via spreadsheet
                                </Link>
                            </p>
                            <button type="submit" disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60">
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Adding</> : <>Add locker <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default AddSingleLocker;
