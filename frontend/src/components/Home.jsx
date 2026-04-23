import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Grid3x3, Users, BellRing, FileText, Key, Clock } from "lucide-react";
import DashNav from "./DashNav";

const Principle = ({ num, title, children }) => (
    <div className="border-t border-ink-900/15 pt-5">
        <div className="flex items-baseline gap-3 mb-2">
            <span className="lw-section-num">{num}</span>
            <h3 className="font-display text-xl text-ink-900 leading-tight">{title}</h3>
        </div>
        <p className="text-slate-600 leading-relaxed max-w-md">{children}</p>
    </div>
);

const Feature = ({ num, Icon, title, body }) => (
    <div className="flex gap-5 p-6 border border-ink-900/10 bg-white">
        <div className="flex-shrink-0 w-10 h-10 bg-cream-100 border border-ink-900/10 flex items-center justify-center text-ink-900">
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <div className="lw-eyebrow mb-1">{num}</div>
            <h4 className="font-display text-lg text-ink-900 leading-tight mb-1.5">{title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
        </div>
    </div>
);

const Home = () => {
    return (
        <div className="lw-page lw-grain flex flex-col min-h-screen">
            <DashNav />

            {/* Hero / Cover Page */}
            <section className="px-6 sm:px-10 lg:px-16 pt-16 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-14">
                        <div className="lw-section-num">LockerWise / Brand Manual / Edition 01</div>
                        <div className="lw-eyebrow hidden sm:block">A facility-management system</div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="font-display text-ink-900 leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
                                Locker keeping,
                                <br />
                                <span className="italic font-normal text-brass-400">kept properly.</span>
                            </h1>
                            <div className="lw-rule-brass w-24 mt-8 mb-6" />
                            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                                LockerWise is the quiet, institutional backbone for assigning, renewing, and retiring
                                physical lockers — built for facilities teams who would rather not rely on a shared
                                spreadsheet and a yellowed clipboard.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-10">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors"
                                >
                                    Sign in <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/contact-us"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-ink-900 text-ink-900 font-mono text-xs uppercase tracking-editorial hover:bg-ink-900 hover:text-cream-50 transition-colors"
                                >
                                    Contact facilities
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="border border-ink-900/15 p-6 bg-cream-50">
                                <div className="lw-eyebrow mb-4">At a glance</div>
                                <dl className="space-y-4">
                                    <div className="flex justify-between items-baseline border-b border-ink-900/10 pb-3">
                                        <dt className="font-mono text-xs uppercase tracking-editorial text-slate-500">Roles</dt>
                                        <dd className="font-display text-xl text-ink-900">Admin · Staff</dd>
                                    </div>
                                    <div className="flex justify-between items-baseline border-b border-ink-900/10 pb-3">
                                        <dt className="font-mono text-xs uppercase tracking-editorial text-slate-500">Lifecycle</dt>
                                        <dd className="font-display text-xl text-ink-900">Assign · Renew · Retire</dd>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <dt className="font-mono text-xs uppercase tracking-editorial text-slate-500">Cadence</dt>
                                        <dd className="font-display text-xl text-ink-900">Daily</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 border-t border-ink-900/10 bg-cream-50">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="lw-section-num mb-3">01 / Philosophy</div>
                        <h2 className="font-display text-4xl text-ink-900 leading-tight">
                            A custodian, <span className="italic">not a CEO.</span>
                        </h2>
                        <p className="mt-5 text-slate-600 leading-relaxed">
                            We sell against yellowed clipboards and shared spreadsheets. So the product reads
                            like a well-kept facilities manual — grid-true, plain-spoken, warm where it matters,
                            accountable where it counts.
                        </p>
                    </div>
                    <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
                        <Principle num="01" title="Grid-true">
                            Everything aligns to a column and a row. Locker rosters, not dashboards.
                        </Principle>
                        <Principle num="02" title="Plain-spoken">
                            Labels over jargon. “Assign locker,” not “provision resource.”
                        </Principle>
                        <Principle num="03" title="Warm metal">
                            Midnight ink, cream paper, brass accents. The hardware, in ink form.
                        </Principle>
                        <Principle num="04" title="Accountable">
                            Timestamps, owners, statuses. Every assignment has a paper trail.
                        </Principle>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 border-t border-ink-900/10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
                        <div>
                            <div className="lw-section-num mb-2">02 / What it does</div>
                            <h2 className="font-display text-4xl text-ink-900 leading-tight max-w-2xl">
                                Assignment, renewal, reporting — <span className="italic">on one ledger.</span>
                            </h2>
                        </div>
                        <div className="lw-eyebrow">Six primary jobs</div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-ink-900/10 divide-y md:divide-y-0 md:divide-x divide-ink-900/10 [&>*:nth-child(n+4)]:border-t [&>*:nth-child(n+4)]:border-ink-900/10">
                        <Feature
                            num="01"
                            Icon={Grid3x3}
                            title="Locker roster"
                            body="Every locker, every status — occupied, available, expired, flagged — in a single indexed view."
                        />
                        <Feature
                            num="02"
                            Icon={Key}
                            title="Assign & renew"
                            body="Bind a locker to an employee for 3, 6, or 12 months. Renewals inherit history."
                        />
                        <Feature
                            num="03"
                            Icon={Clock}
                            title="Expiry automation"
                            body="Daily cron emails on expiry day, auto-expiry of overdue lockers, and rolling history cleanup."
                        />
                        <Feature
                            num="04"
                            Icon={Users}
                            title="Staff & roles"
                            body="Admin and Staff roles with protected routes. Staff do the rounds; admins own the ledger."
                        />
                        <Feature
                            num="05"
                            Icon={BellRing}
                            title="Issue reporting"
                            body="Locker and technical issues flow into one queue for triage and resolution tracking."
                        />
                        <Feature
                            num="06"
                            Icon={FileText}
                            title="Bulk & history"
                            body="Upload lockers by spreadsheet; inspect a full three-month history of every assignment."
                        />
                    </div>
                </div>
            </section>

            {/* About / Closing */}
            <section className="px-6 sm:px-10 lg:px-16 py-20 border-t border-ink-900/10 bg-cream-50">
                <div className="max-w-4xl mx-auto">
                    <div className="lw-section-num mb-3">03 / Colophon</div>
                    <h2 className="font-display text-3xl sm:text-4xl text-ink-900 leading-tight">
                        Built for facilities teams who prefer <span className="italic">a ledger</span> over a launch plan.
                    </h2>
                    <div className="lw-rule-brass w-20 my-6" />
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                        LockerWise is a secure, role-based locker-lifecycle system. Admins own inventory,
                        pricing, and staff. Staff assign and maintain. Employees get a simple, legible
                        record of what locker is theirs, and for how long.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-ink-900 text-cream-50/80 px-6 sm:px-10 lg:px-16 py-14 mt-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div>
                        <div className="text-cream-50">
                            <span className="font-display text-2xl">LockerWise</span>
                        </div>
                        <p className="lw-eyebrow mt-3 text-cream-50/50">
                            © {new Date().getFullYear()} DraconX INC · All rights reserved
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-6 font-mono text-[0.7rem] uppercase tracking-editorial">
                        <Link to="/privacy-policy" className="hover:text-brass-300 transition-colors">
                            Privacy
                        </Link>
                        <Link to="/terms-of-service" className="hover:text-brass-300 transition-colors">
                            Terms
                        </Link>
                        <Link to="/contact-us" className="hover:text-brass-300 transition-colors">
                            Contact
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default Home;
