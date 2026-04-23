import React, { useContext, lazy} from "react";
import { LockerContext } from "../context/LockerProvider";
import Layout from "./Layout";
import { DollarSign, Edit2, Save, CheckCircle } from "lucide-react";


const UpdateLockerPrice = () => {
    const { isEditable, lockerPrices, toggleEditable, handleInputChange, saveLockerPrice } = useContext(LockerContext);
    const renderLockerRow = (lockerType, lockerLabel, lockerGender) => (
        <tr className="bg-white hover:bg-gray-100 transition-colors border-b border-gray-200">
            <td className="px-4 py-3 text-gray-700 font-medium">{lockerGender}</td>
            <td className="px-4 py-3 text-gray-700 font-medium">{lockerLabel}</td>
            {["threeMonths", "sixMonths", "twelveMonths"].map((duration) => (
                <td key={duration} className="px-4 py-3">
                    <input
                        type="text"
                        name={duration}
                        className={`w-full px-3 py-2 text-sm text-gray-700 border-2 rounded-lg outline-none focus:ring-2 transition-colors ${
                            isEditable[lockerType] 
                                ? "border-gray-500 focus:ring-gray-500 focus:border-gray-500 bg-white" 
                                : "border-gray-300 bg-gray-100 cursor-not-allowed"
                        }`}
                        value={lockerPrices[lockerType][duration]}
                        readOnly={!isEditable[lockerType]}
                        onChange={(e) => handleInputChange(e, lockerType, duration)}
                    />
                </td>
            ))}
            <td className="px-4 py-3 text-center">
                <button
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                        isEditable[lockerType] 
                            ? "bg-green-600 text-white hover:bg-green-700 shadow-md" 
                            : "bg-gray-400 text-black hover:bg-gray-500 shadow-md"
                    }`}
                    onClick={() => {
                        if (isEditable[lockerType]) {
                            saveLockerPrice(lockerType);
                        }
                        toggleEditable(lockerType);
                    }}
                >
                    {isEditable[lockerType] ? (
                        <>
                            <Save className="w-4 h-4" />
                            Save
                        </>
                    ) : (
                        <>
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </>
                    )}
                </button>
            </td>
        </tr>
    );

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl py-4 px-4">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Update Locker Price
                        </h1>
                        <p className="text-sm text-gray-600">
                            Customize and update locker prices for different durations
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-300 text-black">
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Gender</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">Locker Type</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">3 Months</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">6 Months</th>
                                    <th className="px-4 py-3 text-left font-semibold border-b border-gray-500">12 Months</th>
                                    <th className="px-4 py-3 text-center font-semibold border-b border-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-50">
                                {renderLockerRow("halfMale", "Half", "Male")}
                                {renderLockerRow("fullMale", "Full", "Male")}
                                {renderLockerRow("halfFemale", "Half", "Female")}
                                {renderLockerRow("fullFemale", "Full", "Female")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default UpdateLockerPrice;
