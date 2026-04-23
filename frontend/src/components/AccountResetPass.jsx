import React, { useState, lazy, useContext } from "react";
import Layout from "./Layout";
import { Key, Lock, Eye, EyeOff, Loader, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";


const AccountResetPass = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPass, setShowOldPass] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetPass, setResetPass] = useState("");
    const [confirmReset, setConfirmReset] = useState("");
    const [oldPass, setOldPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {loginDetails, handlePasswordChange} = useContext(AuthContext)
    const navigate = useNavigate();

    const isValidPassword = (password) => {
        const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError("");
        setSuccess("");
    };


    const  changePass = async(event) => {    
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!isValidPassword(resetPass)) {
            setError("Password must be at least 8 characters and include letters and numbers.");
            setLoading(false);
            return;
        }

        if (resetPass !== confirmReset) {
            setError("New password and confirm password do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await handlePasswordChange(loginDetails.email, oldPass, resetPass);
            if (response === "Password Updated Successfully") {
                setSuccess(response);
                setOldPass("");
                setResetPass("");
                setConfirmReset("");
                localStorage.removeItem("loginDetails");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(response);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
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
                            Change Your Password
                        </h1>
                        <p className="text-sm text-gray-600">
                            Update your password to keep your account secure
                        </p>
                    </div>

                    {/* Reset Password Form */}
                    <form onSubmit={changePass} className="space-y-4">
                        <div className="flex items-center">
                            <label htmlFor="old_password" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                Old Password
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Key className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="old_password"
                                        name="old_password"
                                        type={showOldPass ? "text" : "password"}
                                        required
                                        className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Enter your old password"
                                        value={oldPass}
                                        onChange={handleInputChange(setOldPass)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowOldPass((prev) => !prev)} 
                                        className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors z-10"
                                    >
                                        {showOldPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                New Password
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Key className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Enter your new password"
                                        value={resetPass}
                                        onChange={handleInputChange(setResetPass)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword((prev) => !prev)} 
                                        className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors z-10"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with letters and numbers</p>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="flex items-center">
                            <label htmlFor="confirm" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                Confirm Password
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Key className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="confirm"
                                        name="confirm"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Confirm your new password"
                                        value={confirmReset}
                                        onChange={handleInputChange(setConfirmReset)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword((prev) => !prev)} 
                                        className="absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors z-10"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}
                        
                        {/* Success Message */}
                        {success && (
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-green-800">{success}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-black transition-colors shadow-md ${
                                loading 
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
                                    Update Password
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default AccountResetPass;
