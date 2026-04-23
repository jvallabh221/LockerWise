import React, { useState, lazy, useContext } from "react";
import { Link } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { Loader, ShieldCheck, Hash, Key, ClipboardType, CircleDollarSign, ArrowRightCircleIcon, X, DollarSign } from "lucide-react";
import Layout from "./Layout";


const AddSingleLocker = () => {
    const { addLocker } = useContext(LockerContext);
    const { isEditable, lockerPrices, handleInputChange } = useContext(LockerContext);

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

    const handleLockerType = (e) => {
        setLockerType(e.target.value);
    };

    const handleLockerCode = (index, event) => {
        const newLockerCode = [...lockerCode];
        newLockerCode[index] = event.target.value;
        setLockerCode(newLockerCode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        for(const code of lockerCode) {
            if (!/^\d*\.?\d*$/.test(code)) {
                //console.error("Invalid input: Code must be a positive number.");
                setError("Invalid input: Code must be a positive number.");
                return;
            }
        }
        
        if (!/^\d*\.?\d*$/.test(lockerNumber)) {
            //console.error("Invalid input: Locker Number must be a positive number.");
            setError("Invalid input: Locker Number must be a positive number.");
            return;
        }
        
        if (!/^\d*\.?\d*$/.test(lockerSerialNumber)) {
            //console.error("Invalid input: Serial Code must be a positive number.");
            setError("Invalid input: Serial Code must be a positive number.");
            return;
        }

        setLoading(true);
        
        try {
            await addLocker(lockerType, lockerNumber, lockerCode, lockerPriceThree, lockerPriceSix, lockerPriceYear, gender, lockerSerialNumber);
        } catch (error) {
            //console.error(error);
            setError("Failed to add the locker. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const Checking = () => {};

    const renderLockerRow = (lockerType, lockerLabel, lockerGender) => (
        <tr className="bg-white hover:bg-gray-50 transition-colors">
            <td className="border-b border-gray-200 px-2 py-2 text-center text-gray-700 text-sm">{lockerGender}</td>
            <td className="border-b border-gray-200 px-2 py-2 text-center text-gray-700 text-sm">{lockerLabel}</td>
            {["threeMonths", "sixMonths", "twelveMonths"].map((duration) => (
                <td key={duration} className="border-b border-gray-200 px-2 py-2">
                    <input
                        type="text"
                        name="lockerPrice"
                        className={`w-full px-2 py-1 text-md text-gray-700 border rounded-lg outline-none ${
                            //isEditable[lockerType] ? "border-gray-500 focus:ring-gray-500" : "border-gray-300 bg-gray-100 cursor-not-allowed"
                            "border-gray-300 bg-gray-100 text-center"
                        }`}
                        value={lockerPrices[lockerType][duration]}
                        readOnly={!isEditable[lockerType]}
                        onChange={(e) => handleInputChange(e, lockerType, duration)}
                    />
                </td>
            ))}
        </tr>
    );

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4 relative">
                {/* Price Button - Top Right */}
                <button
                    onClick={() => setShowPriceModal(true)}
                    className="absolute top-4 right-4 bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2 z-10"
                >
                    {/* <DollarSign className="w-4 h-4" /> */}
                    <span className="text-sm font-semibold">Check Locker Prices</span>
                </button>

                {/* Price Modal */}
                {showPriceModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPriceModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Standard Locker Prices</h2>
                                <button
                                    onClick={() => setShowPriceModal(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm border-gray-500 overflow-hidden">
                                    <thead className="text-gray-500">
                                        <tr>
                                            <th className="px-2 sm:px-6 py-2 text-center">Gender</th>
                                            <th className="px-2 sm:px-6 py-2 text-center">Type</th>
                                            <th className="px-2 sm:px-6 py-2 text-center">3 Months</th>
                                            <th className="px-2 sm:px-6 py-2 text-center">6 Months</th>
                                            <th className="px-2 sm:px-6 py-2 text-center">12 Months</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderLockerRow("halfMale", "Half", "Male")}
                                        {renderLockerRow("fullMale", "Full", "Male")}
                                        {renderLockerRow("halfFemale", "Half", "Female")}
                                        {renderLockerRow("fullFemale", "Full", "Female")}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-5xl bg-white p-4 rounded-2xl shadow-xl mt-16">
                    <div className="text-center flex flex-col items-center gap-2 mb-4">
                   
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Add a New Locker
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                id="lockerType"
                                name="lockerType"
                                value={lockerType}
                                onChange={(e) => setLockerType(e.target.value)}
                                className="pl-4 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white text-sm"
                            >
                                <option value="" disabled>
                                    Type of the locker
                                </option>
                                <option value="half">Half</option>
                                <option value="full">Full</option>
                            </select>

                            <select
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="pl-4 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white text-sm"
                            >
                                <option value="" disabled defaultValue={true}>
                                    Type of the gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <label htmlFor="number" className="sr-only">
                                    Locker Number
                                </label>
                                <div className="flex items-center">
                                    <Hash className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="number"
                                        name="number"
                                        type="text"
                                        required
                                        className="pl-10 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Locker Number"
                                        value={lockerNumber}
                                        onChange={(e) => setLockerNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="s-number" className="sr-only">
                                    LockerSerialNumber
                                </label>
                                <div className="flex items-center">
                                    <ClipboardType className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="s-number"
                                        name="s-number"
                                        type="text"
                                        required
                                        className="pl-10 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Serial Number"
                                        value={lockerSerialNumber}
                                        onChange={(e) => setLockerSerialNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div className="relative" key={index}>
                                    <label htmlFor={`code-${index}`} className="sr-only">
                                        LockerCode-{index}
                                    </label>
                                    <div className="flex items-center">
                                        <Key className="absolute left-2 h-4 w-4 text-gray-500 z-10" />
                                        <input
                                            id={`code-${index}`}
                                            name="code"
                                            type="text"
                                            required
                                            className="pl-7 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm text-center"
                                            placeholder={`Code ${index + 1}`}
                                            value={lockerCode[index]}
                                            onChange={(e) => handleLockerCode(index, e)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <label htmlFor="lockerPriceThree" className="sr-only">
                                    LockerPrice3Month
                                </label>
                                <div className="flex items-center">
                                    <CircleDollarSign className="absolute left-2 h-4 w-4 text-gray-500 z-10" />
                                    <input
                                        id="lockerPriceThree"
                                        name="lockerPriceThree"
                                        type="text"
                                        required
                                        className="pl-8 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="3 Months"
                                        value={lockerPriceThree}
                                        onChange={(e) => setLockerPriceThree(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="lockerPriceSix" className="sr-only">
                                    LockerPrice6Month
                                </label>
                                <div className="flex items-center">
                                    <CircleDollarSign className="absolute left-2 h-4 w-4 text-gray-500 z-10" />
                                    <input
                                        id="lockerPriceSix"
                                        name="lockerPriceSix"
                                        type="text"
                                        required
                                        className="pl-8 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="6 Months"
                                        value={lockerPriceSix}
                                        onChange={(e) => setLockerPriceSix(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="lockerPriceYear" className="sr-only">
                                    LockerPrice12Month
                                </label>
                                <div className="flex items-center">
                                    <CircleDollarSign className="absolute left-2 h-4 w-4 text-gray-500 z-10" />
                                    <input
                                        id="lockerPriceYear"
                                        name="lockerPriceYear"
                                        type="text"
                                        required
                                        className="pl-8 outline-none w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="12 Months"
                                        value={lockerPriceYear}
                                        onChange={(e) => setLockerPriceYear(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-black text-sm font-semibold ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-400 hover:bg-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors`}
                        >
                            <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                                {loading ? <Loader className="h-5 w-5 text-lack animate-spin" /> : <ArrowRightCircleIcon className="h-5 w-5 text-white group-hover:text-gray-300" />}
                            </span>
                            {loading ? "Adding..." : "Add the locker"}
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-600">
                            Want to Add Multiple Lockers?{" "}
                            <Link to={"/add_multiple_locker"} className="text-blue hover:underline cursor-pointer">
                                Multiple Lockers
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AddSingleLocker;
