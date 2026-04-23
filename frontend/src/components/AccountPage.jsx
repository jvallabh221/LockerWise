import React, { useState, useContext, useRef } from "react";
import Layout from "./Layout";
import { AuthContext } from "../context/AuthProvider";
import { Edit2, X, Save, Loader, AlertTriangle, CheckCircle2 } from "lucide-react";

const AccountField = ({
    id,
    label,
    value,
    onChange,
    editable,
    onToggle,
    type = "text",
    placeholder,
    inputRef,
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-5 border-t border-ink-900/10 first:border-t-0">
        <label htmlFor={id} className="sm:col-span-3 lw-label sm:pt-2">
            {label}
        </label>
        <div className="sm:col-span-9 flex items-center gap-3">
            <input
                id={id}
                name={id}
                type={type}
                ref={inputRef}
                readOnly={!editable}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`flex-1 ${editable ? "lw-input" : "lw-input cursor-default"} ${!editable ? "text-ink-900" : ""}`}
            />
            <button
                type="button"
                onClick={onToggle}
                className="flex-shrink-0 w-9 h-9 border border-ink-100 bg-white hover:bg-cream-200 hover:border-ink-200 text-ink-900 rounded-md transition-colors flex items-center justify-center"
                aria-label={editable ? "Cancel" : "Edit"}
            >
                {editable ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
        </div>
    </div>
);

const AccountPage = () => {
    const { loginDetails, handleProfileUpdate } = useContext(AuthContext);

    const [username, setUsername] = useState(loginDetails?.name || "");
    const [email, setEmail] = useState(loginDetails?.email || "");
    const [phone, setPhone] = useState(loginDetails?.phoneNumber || "");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [isUsernameEditable, setIsUsernameEditable] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);

    const anyEditable = isUsernameEditable || isEmailEditable || isPhoneEditable;

    const toggle = (field) => {
        if (field === "username") {
            setIsUsernameEditable((s) => !s);
            setTimeout(() => !isUsernameEditable && usernameRef.current?.focus(), 0);
        }
        if (field === "email") {
            setIsEmailEditable((s) => !s);
            setTimeout(() => !isEmailEditable && emailRef.current?.focus(), 0);
        }
        if (field === "phone") {
            setIsPhoneEditable((s) => !s);
            setTimeout(() => !isPhoneEditable && phoneRef.current?.focus(), 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await handleProfileUpdate(loginDetails._id, username, email, loginDetails.password, phone);
            setIsUsernameEditable(false);
            setIsEmailEditable(false);
            setIsPhoneEditable(false);
            setSuccess("Profile updated.");
        } catch (err) {
            setError("Failed to update account details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className="w-full max-w-4xl mx-auto px-6 py-10">
                <div className="lw-section-num mb-2">Account / Profile</div>
                <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-tight">
                    Your record, <span className="text-brass-500">on file.</span>
                </h1>
                <div className="lw-rule-brass w-16 mt-5 mb-2" />
                <p className="text-slate-600 max-w-xl">
                    Review and update your account's personal information. Click the edit icon to change a field.
                </p>

                <form onSubmit={handleSubmit} className="mt-10 border border-ink-900/10 bg-white p-8">
                    <div className="lw-eyebrow mb-2">01 / Personal details</div>

                    <AccountField
                        id="username"
                        label="Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        editable={isUsernameEditable}
                        onToggle={() => toggle("username")}
                        placeholder="Full name"
                        inputRef={usernameRef}
                    />
                    <AccountField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        editable={isEmailEditable}
                        onToggle={() => toggle("email")}
                        placeholder="name@organization.com"
                        inputRef={emailRef}
                    />
                    <AccountField
                        id="phone"
                        label="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        editable={isPhoneEditable}
                        onToggle={() => toggle("phone")}
                        placeholder="+1 ..."
                        inputRef={phoneRef}
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
                            <p className="text-sm">{success}</p>
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-between">
                        <div className="lw-eyebrow text-slate-500">
                            Role: <span className="text-ink-900">{loginDetails?.role || "—"}</span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !anyEditable}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Updating
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </Layout>
    );
};

export default AccountPage;
