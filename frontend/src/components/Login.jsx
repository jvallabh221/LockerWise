import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Eye, EyeOff, Loader, AlertTriangle, ArrowRight } from "lucide-react";
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
        <div className="min-h-screen lw-page lw-grain flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-12 border border-ink-900/10 bg-white shadow-paper">
                {/* Editorial pane */}
                <aside className="lg:col-span-5 bg-cream-50 border-b lg:border-b-0 lg:border-r border-ink-900/10 p-10 flex flex-col justify-between">
                    <div>
                        <Link to="/" className="text-ink-900 hover:text-brass-400 transition-colors">
                            <Wordmark size="md" />
                        </Link>
                        <div className="lw-section-num mt-10 mb-3">01 / Sign in</div>
                        <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-[1.05]">
                            Welcome back, <span className="italic">custodian.</span>
                        </h1>
                        <div className="lw-rule-brass w-16 mt-6 mb-5" />
                        <p className="text-slate-600 leading-relaxed max-w-sm">
                            Your locker ledger, pending your attention. Sign in with your institutional email to
                            continue.
                        </p>
                    </div>
                    <dl className="mt-10 grid grid-cols-2 gap-6">
                        <div>
                            <dt className="lw-eyebrow">Edition</dt>
                            <dd className="font-mono text-sm text-ink-900 mt-1">v1 · 2026</dd>
                        </div>
                        <div>
                            <dt className="lw-eyebrow">Roles</dt>
                            <dd className="font-mono text-sm text-ink-900 mt-1">Admin · Staff</dd>
                        </div>
                    </dl>
                </aside>

                {/* Form pane */}
                <div className="lg:col-span-7 p-10 flex flex-col justify-center">
                    <div className="lw-eyebrow mb-2">Institutional login</div>
                    <h2 className="font-display text-2xl text-ink-900 mb-8">Credentials</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="lw-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="lw-input"
                                placeholder="name@organization.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="lw-label">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="lw-input pr-10"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-ink-900"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="flex items-start gap-2 border border-[#d58874] bg-[#f6dfd5] text-[#7a2a18] px-3 py-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5" />
                                <p className="text-sm">{loginError}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <Link to="/forgot" className="font-mono text-[0.7rem] uppercase tracking-editorial text-slate-500 hover:text-brass-400">
                                Forgot password?
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Signing in
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
