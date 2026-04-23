import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { Loader, AlertTriangle, ArrowRight } from "lucide-react";
import Wordmark from "./ui/Wordmark";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { generateOtp, validateOtp, checkEmail, setCheckEmail } = useContext(AuthContext);

    const [step, setStep] = useState("email");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await generateOtp(checkEmail);
            if (res?.status === 200 || res?.status === 201) setStep("otp");
        } catch (err) {
            setError(err?.message ? "No user with that email." : "Invalid email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await validateOtp(checkEmail, otp);
            if (response.status === 200) navigate("/reset");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lw-page lw-grain flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-12 border border-ink-900/10 bg-white shadow-paper">
                <aside className="lg:col-span-5 bg-cream-50 border-b lg:border-b-0 lg:border-r border-ink-900/10 p-10 flex flex-col justify-between">
                    <div>
                        <Link to="/" className="text-ink-900 hover:text-brass-400 transition-colors">
                            <Wordmark size="md" />
                        </Link>
                        <div className="lw-section-num mt-10 mb-3">
                            {step === "email" ? "02 / Recovery" : "03 / Verification"}
                        </div>
                        <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-[1.05]">
                            {step === "email" ? (
                                <>Forgotten something? <span className="italic">It happens.</span></>
                            ) : (
                                <>Check your <span className="italic">inbox.</span></>
                            )}
                        </h1>
                        <div className="lw-rule-brass w-16 mt-6 mb-5" />
                        <p className="text-slate-600 leading-relaxed max-w-sm">
                            {step === "email"
                                ? "Enter your institutional email — we'll send a one-time code to reset your password."
                                : "A six-digit code has been sent to your email. Enter it here to proceed."}
                        </p>
                    </div>
                    <div className="lw-eyebrow">Step {step === "email" ? "1 of 2" : "2 of 2"}</div>
                </aside>

                <div className="lg:col-span-7 p-10 flex flex-col justify-center">
                    {step === "email" ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="lw-eyebrow mb-2">Request code</div>
                            <h2 className="font-display text-2xl text-ink-900 mb-6">Registered email</h2>
                            <div>
                                <label htmlFor="email" className="lw-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="lw-input"
                                    placeholder="name@organization.com"
                                    value={checkEmail ?? ""}
                                    onChange={(e) => setCheckEmail(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 border border-[#d58874] bg-[#f6dfd5] text-[#7a2a18] px-3 py-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <Link to="/login" className="font-mono text-[0.7rem] uppercase tracking-editorial text-slate-500 hover:text-brass-400">
                                    Back to login
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Sending
                                        </>
                                    ) : (
                                        <>
                                            Request OTP
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="lw-eyebrow mb-2">Verify code</div>
                            <h2 className="font-display text-2xl text-ink-900 mb-6">One-time password</h2>
                            <div>
                                <label htmlFor="otp" className="lw-label">OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    required
                                    className="lw-input font-mono tracking-[0.3em] text-lg"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 border border-[#d58874] bg-[#f6dfd5] text-[#7a2a18] px-3 py-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("email");
                                        setError("");
                                        setOtp("");
                                    }}
                                    className="font-mono text-[0.7rem] uppercase tracking-editorial text-slate-500 hover:text-brass-400"
                                >
                                    Change email
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Verifying
                                        </>
                                    ) : (
                                        <>
                                            Verify OTP
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
