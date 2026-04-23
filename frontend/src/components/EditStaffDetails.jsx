import React, { useState, useContext, lazy, useRef } from "react";
import Layout from "./Layout";
import { User, Mail, Loader, Edit2, X, Phone, Key, Save, AlertTriangle, Edit, UserCircle } from "lucide-react";
import { AdminContext } from "../context/AdminProvider";


const EditStaffDetails = () => {
    const { staffDetails, editStaffDetails } = useContext(AdminContext);

    const [username, setUsername] = useState(staffDetails.user.name || "");
    const [email, setEmail] = useState(staffDetails.user.email || "");
    const [phone, setPhone] = useState(staffDetails.user.phoneNumber || "");
    const GENDER_OPTIONS = ["Male", "Female", "Other"];
    const [gender, setGender] = useState(
        staffDetails?.user?.gender && GENDER_OPTIONS.includes(staffDetails.user.gender)
            ? staffDetails.user.gender
            : staffDetails?.user?.gender || "Male"
    );
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [isUsernameEditable, setIsUsernameEditable] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);
    const [isGenderEditable, setIsGenderEditable] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const genderRef = useRef(null);
    const passwordRef = useRef(null);

    const handleEditClick = (field) => {
        switch (field) {
            case "username":
                setIsUsernameEditable(!isUsernameEditable);
                if (!isUsernameEditable) usernameRef.current?.focus();
                break;
            case "email":
                setIsEmailEditable(!isEmailEditable);
                if (!isEmailEditable) emailRef.current?.focus();
                break;
            case "phone":
                setIsPhoneEditable(!isPhoneEditable);
                if (!isPhoneEditable) phoneRef.current?.focus();
                break;
            case "gender":
                setIsGenderEditable(!isGenderEditable);
                if (!isGenderEditable) genderRef.current?.focus();
                // Ensure gender is a valid option when opening edit
                if (!isGenderEditable && gender && !GENDER_OPTIONS.includes(gender)) {
                    setGender("Male");
                }
                break;
            case "password":
                setIsPasswordEditable(!isPasswordEditable);
                if (!isPasswordEditable) passwordRef.current?.focus();
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await editStaffDetails(staffDetails.user._id, username, staffDetails.user.role, email, password, phone, gender);
            // Reset all fields to readonly
            setIsUsernameEditable(false);
            setIsEmailEditable(false);
            setIsPhoneEditable(false);
            setIsGenderEditable(false);
            setIsPasswordEditable(false);
        } catch (error) {
            //console.error(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                       
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Edit Staff Details
                        </h1>
                        <p className="text-sm text-gray-600">
                            Review and update staff account information
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div className="flex items-center">
                            <label htmlFor="username" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Username
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <User className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="username"
                                        name="username"
                                        ref={usernameRef}
                                        type="text"
                                        readOnly={!isUsernameEditable}
                                        className={`pl-10 pr-10 outline-none w-full py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm ${
                                            isUsernameEditable 
                                                ? "bg-white border-gray-500 focus:border-gray-500" 
                                                : "bg-gray-50 border-gray-300"
                                        }`}
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick("username")}
                                        className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors z-10"
                                    >
                                        {isUsernameEditable ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Edit2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="flex items-center">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Email
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Mail className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="email"
                                        name="email"
                                        ref={emailRef}
                                        type="email"
                                        readOnly={!isEmailEditable}
                                        className={`pl-10 pr-10 outline-none w-full py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm ${
                                            isEmailEditable 
                                                ? "bg-white border-gray-500 focus:border-gray-500" 
                                                : "bg-gray-50 border-gray-300"
                                        }`}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick("email")}
                                        className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors z-10"
                                    >
                                        {isEmailEditable ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Edit2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Phone and Gender in one row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center">
                                <label htmlFor="phone" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Phone
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <Phone className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="phone"
                                            name="phone"
                                            ref={phoneRef}
                                            type="text"
                                            readOnly={!isPhoneEditable}
                                            className={`pl-10 pr-10 outline-none w-full py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm ${
                                                isPhoneEditable 
                                                    ? "bg-white border-gray-500 focus:border-gray-500" 
                                                    : "bg-gray-50 border-gray-300"
                                            }`}
                                            placeholder="Phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoComplete="off"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick("phone")}
                                            className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors z-10"
                                        >
                                            {isPhoneEditable ? (
                                                <X className="h-5 w-5" />
                                            ) : (
                                                <Edit2 className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="gender" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Gender
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <UserCircle className="absolute left-3 h-5 w-5 text-gray-500 z-10 pointer-events-none" />
                                        {isGenderEditable ? (
                                            <select
                                                id="gender"
                                                name="gender"
                                                ref={genderRef}
                                                className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-sm cursor-pointer appearance-none"
                                                value={GENDER_OPTIONS.includes(gender) ? gender : "Male"}
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                {GENDER_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                readOnly
                                                className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg bg-gray-50 text-sm cursor-default"
                                                value={gender}
                                                tabIndex={-1}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleEditClick("gender")}
                                            className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors z-10"
                                        >
                                            {isGenderEditable ? (
                                                <X className="h-5 w-5" />
                                            ) : (
                                                <Edit2 className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex items-center">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Password
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Key className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="password"
                                        name="password"
                                        ref={passwordRef}
                                        type="password"
                                        readOnly={!isPasswordEditable}
                                        className={`pl-10 pr-10 outline-none w-full py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm ${
                                            isPasswordEditable 
                                                ? "bg-white border-gray-500 focus:border-gray-500" 
                                                : "bg-gray-50 border-gray-300"
                                        }`}
                                        placeholder="Set New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick("password")}
                                        className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors z-10"
                                    >
                                        {isPasswordEditable ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Edit2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || (!isUsernameEditable && !isEmailEditable && !isPhoneEditable && !isGenderEditable && !isPasswordEditable)}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                loading || (!isUsernameEditable && !isEmailEditable && !isPhoneEditable && !isGenderEditable && !isPasswordEditable)
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-gray-400 hover:bg-gray-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Details
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default EditStaffDetails;
