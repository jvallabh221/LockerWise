import React, { useState, useContext, useRef, lazy } from "react";
import Layout from "./Layout";
import { AuthContext } from "../context/AuthProvider";
import { User, Mail, Loader, Edit2, X, Phone, Save, AlertTriangle } from "lucide-react";


const AccountPage = () => {
    const { loginDetails, handleProfileUpdate } = useContext(AuthContext);

    const [username, setUsername] = useState(loginDetails.name || "");
    const [email, setEmail] = useState(loginDetails.email || "");
    const [phone, setPhone] = useState(loginDetails.phoneNumber || "");
    const [error, setError] = useState("");

    const [isUsernameEditable, setIsUsernameEditable] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);
    const [loading, setLoading] = useState(false);

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);

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
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await handleProfileUpdate(loginDetails._id, username, email, loginDetails.password, phone);
            setIsUsernameEditable(false);
            setIsEmailEditable(false);
            setIsPhoneEditable(false);
        } catch (error) {
            //console.error(error);
            setError("Failed to update account details. Please try again.");
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
                            Edit Your Account Details
                        </h1>
                        <p className="text-sm text-gray-600">
                            Review and update your account's personal information
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
                                        type="text"
                                        ref={usernameRef}
                                        readOnly={!isUsernameEditable}
                                        className={`pl-10 pr-10 outline-none w-full py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm ${
                                            isUsernameEditable 
                                                ? "bg-white border-gray-500 focus:border-gray-500" 
                                                : "bg-gray-50 border-gray-300"
                                        }`}
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                                        type="email"
                                        ref={emailRef}
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

                        {/* Phone Field */}
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
                                        type="text"
                                        ref={phoneRef}
                                        readOnly={!isPhoneEditable}
                                        className={`pl-10 pr-10 outline-none w-full py-2 border-2 rounded-lg focus:ring-2 focus:ring-gray-500 transition-colors text-sm ${
                                            isPhoneEditable 
                                                ? "bg-white border-gray-500 focus:border-gray-500" 
                                                : "bg-gray-50 border-gray-300"
                                        }`}
                                        placeholder="Phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
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

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || (!isUsernameEditable && !isEmailEditable && !isPhoneEditable)}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-md ${
                                loading || (!isUsernameEditable && !isEmailEditable && !isPhoneEditable)
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

export default AccountPage;
