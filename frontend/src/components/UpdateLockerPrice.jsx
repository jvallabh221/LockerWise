import React, { useContext } from "react";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { Edit2, Save } from "lucide-react";
import { PageShell } from "./ui/FormShell";

const UpdateLockerPrice = () => {
    const { isEditable, lockerPrices, toggleEditable, handleInputChange, saveLockerPrice } = useContext(LockerContext);

    const renderRow = (typeKey, label, genderLabel) => (
        <tr className="border-b border-ink-900/10">
            <td className="px-4 py-3 font-mono text-xs text-ink-900">{genderLabel}</td>
            <td className="px-4 py-3 font-mono text-xs text-ink-900">{label}</td>
            {["threeMonths", "sixMonths", "twelveMonths"].map((d) => (
                <td key={d} className="px-4 py-3">
                    <input
                        type="text"
                        value={lockerPrices[typeKey][d]}
                        readOnly={!isEditable[typeKey]}
                        onChange={(e) => handleInputChange(e, typeKey, d)}
                        className={`w-full bg-transparent border-b ${isEditable[typeKey] ? "border-brass-400" : "border-ink-900/15"} text-sm font-mono text-ink-900 py-1 focus:outline-none focus:border-brass-400 transition-colors`}
                    />
                </td>
            ))}
            <td className="px-4 py-3">
                <button
                    onClick={() => {
                        if (isEditable[typeKey]) saveLockerPrice(typeKey);
                        toggleEditable(typeKey);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        isEditable[typeKey]
                            ? "bg-brass-400 text-white hover:bg-brass-500 shadow-xs"
                            : "border border-ink-100 text-ink-900 bg-white hover:bg-cream-200 hover:border-ink-200"
                    }`}
                >
                    {isEditable[typeKey] ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
                </button>
            </td>
        </tr>
    );

    return (
        <Layout>
            <PageShell
                eyebrow="Inventory / Pricing"
                title="Update"
                italicTitle="locker pricing."
                description="Adjust prices by gender, type, and duration. Changes apply to new assignments."
            >
                <div className="mt-8 border border-ink-900/10 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-ink-900/15 bg-cream-50">
                                    {["Gender", "Type", "3 mo", "6 mo", "12 mo", "Action"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {renderRow("halfMale", "Half", "Male")}
                                {renderRow("fullMale", "Full", "Male")}
                                {renderRow("halfFemale", "Half", "Female")}
                                {renderRow("fullFemale", "Full", "Female")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </PageShell>
        </Layout>
    );
};

export default UpdateLockerPrice;
