import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { Loader2, AlertTriangle, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
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
        <div className="min-h-screen lw-page flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="text-[var(--text)] hover:text-brass-500 transition-colors">
                        <Wordmark size="md" />
                    </Link>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-8">
                    {step === "email" ? (
                        <>
                            <div className="lw-eyebrow mb-2">Recover account</div>
                            <h1 className="font-display text-2xl text-[var(--text)] font-semibold leading-tight">
                                Forgot your password?
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                Enter your institutional email and we'll send a one-time code to verify your account.
                            </p>

                            <form onSubmit={handleEmailSubmit} className="space-y-5 mt-6">
                                <div>
                                    <label htmlFor="email" className="lw-label">Email address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="lw-input"
                                        placeholder="name@organization.com"
                                        value={checkEmail ?? ""}
                                        onChange={(e) => setCheckEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 border border-error-500/25 bg-error-50 text-error-700 rounded-lg px-3 py-2.5">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brass-400 hover:bg-brass-500 active:bg-brass-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending code…
                                        </>
                                    ) : (
                                        <>
                                            Send verification code
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto w-12 h-12 rounded-full bg-brass-50 text-brass-500 flex items-center justify-center mb-4">
                                <MailCheck className="w-5 h-5" />
                            </div>
                            <h1 className="font-display text-2xl text-[var(--text)] font-semibold leading-tight text-center">
                                Check your inbox
                            </h1>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed text-center">
                                We sent a 6-digit code to{" "}
                                <span className="text-[var(--text)] font-medium">{checkEmail}</span>.
                                Enter it below to continue.
                            </p>

                            <form onSubmit={handleOtpSubmit} className="space-y-5 mt-6">
                                <div>
                                    <label htmlFor="otp" className="lw-label">Verification code</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        required
                                        className="lw-input font-mono tracking-[0.4em] text-lg text-center"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        maxLength={6}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 border border-error-500/25 bg-error-50 text-error-700 rounded-lg px-3 py-2.5">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brass-400 hover:bg-brass-500 active:bg-brass-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Verifying…
                                        </>
                                    ) : (
                                        <>
                                            Verify code
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("email");
                                        setError("");
                                        setOtp("");
                                    }}
                                    className="w-full text-sm font-medium text-slate-500 hover:text-brass-500 transition-colors"
                                >
                                    Use a different email
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="mt-5 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brass-500 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
