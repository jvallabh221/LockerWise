import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Grid3x3,
    Users,
    BellRing,
    FileText,
    Key,
    Clock,
    ShieldCheck,
    BarChart3,
    CheckCircle2,
} from "lucide-react";
import DashNav from "./DashNav";

/* -------------------------------- Bits --------------------------------- */

const Feature = ({ Icon, title, body }) => (
    <div className="bg-white border border-ink-100 rounded-xl p-6 hover:shadow-paper transition-shadow">
        <div className="w-11 h-11 bg-brass-50 text-brass-500 rounded-lg flex items-center justify-center mb-4">
            <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-display text-base font-semibold text-ink-900 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
    </div>
);

const Kpi = ({ label, value, hint }) => (
    <div className="bg-white border border-ink-100 rounded-xl p-5">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{label}</div>
        <div className="font-display text-2xl font-semibold text-ink-900 leading-none">{value}</div>
        {hint ? <div className="mt-1.5 text-xs text-slate-400">{hint}</div> : null}
    </div>
);

const Bullet = ({ children }) => (
    <li className="flex items-start gap-2.5 text-slate-600">
        <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
        <span className="text-sm leading-relaxed">{children}</span>
    </li>
);

/* --------------------------------- Page -------------------------------- */

const Home = () => {
    return (
        <div className="lw-page flex flex-col min-h-screen">
            <DashNav />

            {/* Hero */}
            <section className="relative px-6 sm:px-10 lg:px-16 pt-16 pb-24 overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-60 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 85% 0%, rgba(14,165,233,0.10), transparent 50%), radial-gradient(circle at 0% 100%, rgba(186,230,253,0.35), transparent 45%)",
                    }}
                />
                <div className="relative max-w-6xl mx-auto">
                    <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-brass-50 text-brass-600 rounded-full border border-brass-400/20 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-brass-400 animate-pulse" />
                            Trusted by facilities teams
                        </span>
                    </div>
                    <h1 className="mt-6 text-center font-display text-ink-900 font-semibold leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto">
                        Locker operations, <span className="text-brass-500">streamlined.</span>
                    </h1>
                    <p className="mt-5 text-center text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        LockerWise is the institutional backbone for assigning, renewing, and retiring physical
                        lockers — built for facilities teams that value clarity and accountability.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors"
                        >
                            Sign in <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/contact-us"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink-900 border border-ink-100 hover:bg-cream-200 hover:border-ink-200 font-medium text-sm rounded-md transition-colors"
                        >
                            Talk to us
                        </Link>
                    </div>

                    {/* KPI rail */}
                    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Kpi label="Roles" value="Admin · Staff" hint="Protected routes per role" />
                        <Kpi label="Lifecycle" value="Assign → Renew → Retire" hint="With audit trail" />
                        <Kpi label="Cadence" value="Daily automations" hint="Expiry + reminders" />
                        <Kpi label="Edition" value="v1 · 2026" hint="Single-service deploy" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 border-t border-ink-100 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-2xl mb-12">
                        <div className="lw-eyebrow mb-2">What it does</div>
                        <h2 className="font-display text-3xl sm:text-4xl text-ink-900 font-semibold leading-tight">
                            Assignment, renewal, reporting — on one ledger.
                        </h2>
                        <p className="mt-3 text-slate-500 leading-relaxed">
                            Everything facilities teams need to run a locker program without clipboards or shared
                            spreadsheets. Six primary jobs, one clean system.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Feature
                            Icon={Grid3x3}
                            title="Locker roster"
                            body="Every locker and its status — occupied, available, expired, flagged — in one indexed view."
                        />
                        <Feature
                            Icon={Key}
                            title="Assign & renew"
                            body="Bind a locker to an employee for 3, 6, or 12 months. Renewals inherit full history."
                        />
                        <Feature
                            Icon={Clock}
                            title="Expiry automation"
                            body="Daily cron reminders on expiry day, auto-expiry of overdue lockers, and clean rollovers."
                        />
                        <Feature
                            Icon={Users}
                            title="Staff & roles"
                            body="Admin and Staff roles with protected routes. Staff do the rounds; admins own the ledger."
                        />
                        <Feature
                            Icon={BellRing}
                            title="Issue reporting"
                            body="Locker and technical issues flow into one queue for triage and resolution tracking."
                        />
                        <Feature
                            Icon={FileText}
                            title="Bulk & history"
                            body="Upload lockers by spreadsheet; inspect a full three-month history of every assignment."
                        />
                    </div>
                </div>
            </section>

            {/* Why LockerWise */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 border-t border-ink-100">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-5">
                        <div className="lw-eyebrow mb-2">Why LockerWise</div>
                        <h2 className="font-display text-3xl sm:text-4xl text-ink-900 font-semibold leading-tight">
                            Built for the way facilities teams actually work.
                        </h2>
                        <p className="mt-4 text-slate-500 leading-relaxed">
                            A modern, institution-friendly SaaS that replaces yellowed clipboards and shared
                            spreadsheets with a secure, accountable system of record.
                        </p>
                    </div>
                    <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
                        <div>
                            <div className="w-10 h-10 bg-brass-50 text-brass-500 rounded-lg flex items-center justify-center mb-3">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="font-display text-base font-semibold text-ink-900 mb-1.5">Operationally strong</h3>
                            <ul className="space-y-2">
                                <Bullet>Live locker counts across every status</Bullet>
                                <Bullet>Three-month rolling assignment history</Bullet>
                                <Bullet>Issue triage queue with resolution tracking</Bullet>
                            </ul>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-brass-50 text-brass-500 rounded-lg flex items-center justify-center mb-3">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-display text-base font-semibold text-ink-900 mb-1.5">Secure by default</h3>
                            <ul className="space-y-2">
                                <Bullet>JWT-based auth with role enforcement</Bullet>
                                <Bullet>Protected routes for Admin and Staff</Bullet>
                                <Bullet>Encrypted transport, hashed credentials</Bullet>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 sm:px-10 lg:px-16 py-16 border-t border-ink-100 bg-white">
                <div className="max-w-4xl mx-auto bg-ink-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.12] pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 90% 20%, #0EA5E9 0, transparent 40%)",
                        }}
                    />
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                                Ready to run your locker program cleanly?
                            </h2>
                            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
                                Sign in if you already have an account, or reach out to your facilities administrator
                                to request access.
                            </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md transition-colors"
                            >
                                Sign in <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/contact-us"
                                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/25 hover:border-white/50 hover:bg-white/5 text-white font-medium text-sm rounded-md transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-ink-900 text-white/80 px-6 sm:px-10 lg:px-16 py-12 mt-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <Wordmark size="md" className="text-white" />
                        <p className="mt-3 text-xs text-white/50">
                            © {new Date().getFullYear()} DraconX Inc. · All rights reserved.
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-5 text-sm">
                        <Link to="/privacy-policy" className="hover:text-brass-300 transition-colors">Privacy</Link>
                        <Link to="/terms-of-service" className="hover:text-brass-300 transition-colors">Terms</Link>
                        <Link to="/contact-us" className="hover:text-brass-300 transition-colors">Contact</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default Home;
