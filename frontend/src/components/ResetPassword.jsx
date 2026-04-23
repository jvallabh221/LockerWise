import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Eye, EyeOff, Loader2, ArrowRight, AlertTriangle, ArrowLeft, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import Wordmark from "./ui/Wordmark";

const ResetPassword = () => {
    const [resetPass, setResetPass] = useState("");
    const [confirmReset, setConfirmReset] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { resetPassword, checkEmail } = useContext(AuthContext);

    const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!isValidPassword(resetPass)) {
            setError("Password must be at least 8 characters and include letters and numbers.");
            return;
        }
        if (resetPass !== confirmReset) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(checkEmail, confirmReset);
        } catch (err) {
            setError("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lw-page flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="text-ink-900 hover:text-brass-500 transition-colors">
                        <Wordmark size="md" />
                    </Link>
                </div>

                <div className="bg-white border border-ink-100 rounded-xl shadow-paper p-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-brass-50 text-brass-500 flex items-center justify-center mb-4">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <h1 className="font-display text-2xl text-ink-900 font-semibold leading-tight text-center">
                        Set a new password
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed text-center">
                        Choose a strong password. Use at least 8 characters with letters and numbers.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                        <div>
                            <label htmlFor="password" className="lw-label">New password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="lw-input pr-11"
                                    placeholder="Enter new password"
                                    value={resetPass}
                                    onChange={(e) => setResetPass(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-ink-900 hover:bg-cream-200 transition-colors"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm" className="lw-label">Confirm password</label>
                            <div className="relative">
                                <input
                                    id="confirm"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="lw-input pr-11"
                                    placeholder="Retype password"
                                    value={confirmReset}
                                    onChange={(e) => setConfirmReset(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-ink-900 hover:bg-cream-200 transition-colors"
                                    aria-label="Toggle password visibility"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
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
                                    Updating…
                                </>
                            ) : (
                                <>
                                    Update password
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-5 text-center">
                    <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brass-500 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
