import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Eye, EyeOff, Loader, ArrowRight, AlertTriangle } from "lucide-react";
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

    const isValidPassword = (password) => {
        const strong = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return strong.test(password);
    };

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
        <div className="min-h-screen lw-page lw-grain flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-md bg-white border border-ink-900/10 shadow-paper p-10">
                <Link to="/" className="text-ink-900 hover:text-brass-400 transition-colors">
                    <Wordmark size="md" />
                </Link>
                <div className="lw-section-num mt-8 mb-2">04 / New password</div>
                <h1 className="font-display text-3xl text-ink-900 leading-tight">
                    Set a new <span className="italic">passphrase.</span>
                </h1>
                <div className="lw-rule-brass w-16 mt-5 mb-6" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="lw-label">New password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="lw-input pr-10"
                                placeholder="Min 8 chars, letters + numbers"
                                value={resetPass}
                                onChange={(e) => setResetPass(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-ink-900"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm" className="lw-label">Confirm new password</label>
                        <div className="relative">
                            <input
                                id="confirm"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="lw-input pr-10"
                                placeholder="Retype password"
                                value={confirmReset}
                                onChange={(e) => setConfirmReset(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-ink-900"
                                aria-label="Toggle password visibility"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 border border-[#d58874] bg-[#f6dfd5] text-[#7a2a18] px-3 py-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Updating
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
        </div>
    );
};

export default ResetPassword;
