import React, { useState, useContext } from "react";
import Layout from "./Layout";
import { Eye, EyeOff, Loader, Save, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const PasswordField = ({ id, label, value, onChange, show, onToggleShow, placeholder, hint }) => (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-5 border-t border-[var(--border)] first:border-t-0">
        <label htmlFor={id} className="sm:col-span-3 lw-label sm:pt-2">{label}</label>
        <div className="sm:col-span-9">
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={show ? "text" : "password"}
                    required
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="lw-input pr-10"
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[var(--text)]"
                    aria-label="Toggle visibility"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {hint ? <p className="text-xs text-slate-500 mt-2">{hint}</p> : null}
        </div>
    </div>
);

const AccountResetPass = () => {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [oldPass, setOldPass] = useState("");
    const [resetPass, setResetPass] = useState("");
    const [confirmReset, setConfirmReset] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { loginDetails, handlePasswordChange } = useContext(AuthContext);
    const navigate = useNavigate();

    const isValidPassword = (p) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(p);

    const onChange = (setter) => (e) => {
        setter(e.target.value);
        setError("");
        setSuccess("");
    };

    const changePass = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!isValidPassword(resetPass)) {
            setError("Password must be at least 8 characters and include letters and numbers.");
            setLoading(false);
            return;
        }
        if (resetPass !== confirmReset) {
            setError("New password and confirmation do not match.");
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
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className="w-full max-w-4xl mx-auto px-6 py-10">
                <div className="lw-section-num mb-2">Account / Security</div>
                <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)] font-semibold leading-tight tracking-tight">
                    Change your <span className="text-brass-500">password.</span>
                </h1>
                <div className="lw-rule-brass w-16 mt-5 mb-2" />
                <p className="text-slate-600 max-w-xl">
                    For security, provide your current password and set a new one. You'll be signed out after the change.
                </p>

                <form onSubmit={changePass} className="mt-10 border border-[var(--border)] bg-[var(--surface)] p-8">
                    <div className="lw-eyebrow mb-2">01 / Credentials</div>

                    <PasswordField
                        id="old_password"
                        label="Current"
                        value={oldPass}
                        onChange={onChange(setOldPass)}
                        show={showOld}
                        onToggleShow={() => setShowOld((s) => !s)}
                        placeholder="Enter current password"
                    />
                    <PasswordField
                        id="password"
                        label="New"
                        value={resetPass}
                        onChange={onChange(setResetPass)}
                        show={showNew}
                        onToggleShow={() => setShowNew((s) => !s)}
                        placeholder="At least 8 chars, letters + numbers"
                        hint="Must be 8+ characters and contain both letters and numbers."
                    />
                    <PasswordField
                        id="confirm"
                        label="Confirm"
                        value={confirmReset}
                        onChange={onChange(setConfirmReset)}
                        show={showConfirm}
                        onToggleShow={() => setShowConfirm((s) => !s)}
                        placeholder="Retype new password"
                    />

                    {error && (
                        <div className="mt-6 flex items-start gap-2 border border-error-500/25 bg-error-50 text-error-700 rounded-lg px-3 py-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mt-6 flex items-start gap-2 border border-success-500/25 bg-success-50 text-success-700 rounded-lg px-3 py-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5" />
                            <p className="text-sm">{success} — redirecting to sign-in.</p>
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Updating
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Update password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </Layout>
    );
};

export default AccountResetPass;
