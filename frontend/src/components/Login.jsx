import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Eye, EyeOff, Loader2, AlertTriangle, ArrowRight, KeyRound, ShieldCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Wordmark from "./ui/Wordmark";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setLoginError(err?.message || err?.toString() || "Unable to sign in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lw-page flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-12 border border-ink-100 bg-white shadow-paper rounded-2xl overflow-hidden">
                {/* Brand pane */}
                <aside className="lg:col-span-5 bg-ink-900 text-white p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle at 20% 20%, #0EA5E9 0, transparent 40%), radial-gradient(circle at 80% 80%, #BAE6FD 0, transparent 35%)",
                        }}
                    />
                    <div className="relative">
                        <Link to="/" className="text-white hover:text-brass-200 transition-colors">
                            <Wordmark size="md" />
                        </Link>
                        <h1 className="mt-12 font-display text-3xl lg:text-4xl text-white font-semibold leading-[1.15] tracking-tight">
                            Sign in to manage your locker operations.
                        </h1>
                        <p className="mt-4 text-slate-300 leading-relaxed max-w-sm text-[0.95rem]">
                            A modern control room for assigning, renewing, and tracking physical lockers across your organization.
                        </p>
                    </div>
                    <div className="relative mt-10 grid grid-cols-1 gap-3">
                        <Feature Icon={KeyRound} title="Unified locker ledger" />
                        <Feature Icon={ShieldCheck} title="Role-based access control" />
                        <Feature Icon={Clock} title="Automated expiry workflows" />
                    </div>
                </aside>

                {/* Form pane */}
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-white">
                    <div className="lw-eyebrow mb-2">Welcome back</div>
                    <h2 className="font-display text-2xl text-ink-900 font-semibold mb-1">Sign in to LockerWise</h2>
                    <p className="text-sm text-slate-500 mb-8">Use your institutional email and password to continue.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="lw-label">Email address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="lw-input"
                                placeholder="name@organization.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="lw-label mb-0">Password</label>
                                <Link to="/forgot" className="text-xs font-medium text-brass-500 hover:text-brass-600 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="lw-input pr-11"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-ink-900 hover:bg-cream-200 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="flex items-start gap-2 border border-error-500/25 bg-error-50 text-error-700 rounded-lg px-3 py-2.5">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="text-sm leading-relaxed">{loginError}</p>
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
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-slate-400 text-center pt-2">
                            By signing in you agree to our{" "}
                            <Link to="/terms-of-service" className="text-slate-500 hover:text-brass-500 underline underline-offset-2">Terms</Link>
                            {" "}and{" "}
                            <Link to="/privacy-policy" className="text-slate-500 hover:text-brass-500 underline underline-offset-2">Privacy Policy</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Feature = ({ Icon, title }) => (
    <div className="flex items-center gap-3 text-slate-200/90">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-brass-200">
            <Icon className="w-4 h-4" />
        </span>
        <span className="text-sm">{title}</span>
    </div>
);

export default Login;
