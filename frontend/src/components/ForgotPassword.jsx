import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { Mail, Loader, KeyRound, AlertTriangle, Send } from "lucide-react";

const CombinedForm = () => {
    const navigate = useNavigate();
    const { generateOtp, validateOtp, checkEmail, setCheckEmail } = useContext(AuthContext);

    const [step, setStep] = useState("email"); // "email" or "otp"
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handlers for Email Form
    const handlecheckEmail = (e) => setCheckEmail(e.target.value);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await generateOtp(checkEmail);
            if(res?.status === 200 || res?.status === 201){
                setStep("otp"); // Move to OTP step
            }
        } catch (error) {
            setError(error.message ? "!!! No User Exists !!!" : "Invalid Email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handlers for OTP Form
    const handleOtp = (e) => setOtp(e.target.value);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await validateOtp(checkEmail, otp);
            if(response.status === 200)
                navigate("/reset"); // Redirect to a secure page after OTP validation
        } catch (error) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center py-6 px-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10 min-h-[400px] flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center justify-center">
                    {/* LEFT SECTION */}
                    <div className="flex flex-col items-center justify-center text-center px-6 md:border-r md:border-gray-300 md:pr-10">
                        <img
                            src="/newNew.png"
                            alt="SafeLocker Logo"
                            className="h-40 w-40 mb-6 drop-shadow-xl transition-transform duration-300 hover:scale-110"
                        />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                            {step === "email" ? "Forgot Password?" : "Verify OTP"}
                        </h1>
                        <p className="text-gray-600 mt-4 text-lg">
                            {step === "email" 
                                ? "Enter your registered email to receive OTP" 
                                : "Enter the OTP sent to your email"}
                        </p>
                        <p className="text-gray-500 text-base mt-3 max-w-md">
                            {step === "email"
                                ? "We'll send you a one-time password to reset your account."
                                : "Check your email inbox for the verification code."}
                        </p>
                    </div>

                    {/* RIGHT SECTION - FORM */}
                    <div className="flex flex-col justify-center md:pl-10">
                        {step === "email" ? (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                {/* EMAIL */}
                                <div className="flex items-center">
                                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-20">
                                        Email
                                    </label>
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Enter your email"
                                            value={checkEmail ?? ""}
                                            onChange={handlecheckEmail}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                )}

                                {/* BACK TO LOGIN */}
                                <div className="flex items-center justify-end">
                                    <Link
                                        to={"/login"}
                                        className="text-sm text-gray-600 hover:text-gray-700 hover:underline font-medium"
                                    >
                                        Back to Login
                                    </Link>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full 
                                    font-semibold text-black transition-all shadow-md ${
                                        loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-400 hover:bg-gray-500 hover:shadow-lg"
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Request OTP
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleOtpSubmit} className="space-y-4">
                                {/* OTP */}
                                <div className="flex items-center">
                                    <label htmlFor="otp" className="text-sm font-semibold text-gray-700 w-20">
                                        OTP
                                    </label>
                                    <div className="relative flex-1">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Enter your OTP"
                                            value={otp}
                                            onChange={handleOtp}
                                        />
                                    </div>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        <p className="text-sm font-medium text-red-800">{error}</p>
                                    </div>
                                )}

                                {/* BACK TO EMAIL */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep("email");
                                            setError("");
                                            setOtp("");
                                        }}
                                        className="text-sm text-gray-600 hover:text-gray-700 hover:underline font-medium"
                                    >
                                        Change Email
                                    </button>
                                    <Link
                                        to={"/login"}
                                        className="text-sm text-gray-600 hover:text-gray-700 hover:underline font-medium"
                                    >
                                        Back to Login
                                    </Link>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full 
                                    font-semibold text-black transition-all shadow-md ${
                                        loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-400 hover:bg-gray-500 hover:shadow-lg"
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Validating...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Verify OTP
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CombinedForm;
