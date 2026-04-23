import React from "react";
import DashNav from "./DashNav";

const Clause = ({ num, title, children }) => (
    <section className="grid md:grid-cols-12 gap-6 py-8 border-t border-ink-900/10 first:border-t-0">
        <div className="md:col-span-3">
            <div className="lw-section-num mb-2">{num}</div>
            <h2 className="font-display text-2xl text-ink-900 leading-tight">{title}</h2>
        </div>
        <div className="md:col-span-9 text-slate-700 leading-relaxed space-y-4">{children}</div>
    </section>
);

const List = ({ items }) => (
    <ul className="space-y-2 text-slate-700">
        {items.map((it, i) => (
            <li key={i} className="flex gap-3">
                <span className="font-mono text-xs text-brass-400 mt-1">{String(i + 1).padStart(2, "0")}</span>
                <span>{it}</span>
            </li>
        ))}
    </ul>
);

const PrivacyPolicy = () => {
    return (
        <div className="lw-page lw-grain min-h-screen flex flex-col">
            <DashNav />
            <section className="px-6 sm:px-10 lg:px-16 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="lw-eyebrow mb-3">Colophon / Policy</div>
                    <h1 className="font-display text-5xl sm:text-6xl text-ink-900 leading-[1]">
                        Privacy, <span className="italic">plainly stated.</span>
                    </h1>
                    <div className="lw-rule-brass w-20 mt-6" />
                    <p className="mt-5 text-slate-600 max-w-2xl leading-relaxed">
                        How LockerWise collects, uses, and safeguards your information. Last updated{" "}
                        <span className="font-mono">
                            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                        .
                    </p>

                    <div className="mt-12 border border-ink-900/10 bg-white p-8 md:p-12">
                        <Clause num="01 / Introduction" title="Our commitment">
                            <p>
                                At LockerWise, we are committed to protecting your privacy and ensuring the security
                                of your personal information. This policy explains how we collect, use, disclose, and
                                safeguard your data when you use our locker management system.
                            </p>
                        </Clause>

                        <Clause num="02 / Collection" title="What we collect">
                            <p className="font-semibold text-ink-900">Personal information</p>
                            <List
                                items={[
                                    "Name and contact information (email, phone)",
                                    "Employee ID and organizational details",
                                    "Account credentials and authentication data",
                                    "Locker assignment and usage history",
                                ]}
                            />
                            <p className="font-semibold text-ink-900 mt-4">Usage information</p>
                            <List
                                items={[
                                    "Login timestamps and session data",
                                    "System access logs and activity records",
                                    "Device information and IP addresses",
                                    "Browser type and version",
                                ]}
                            />
                        </Clause>

                        <Clause num="03 / Purpose" title="How we use it">
                            <List
                                items={[
                                    "Provide, maintain, and improve our locker management services",
                                    "Process assignments, renewals, and cancellations",
                                    "Authenticate users and ensure system security",
                                    "Send notifications and important updates",
                                    "Generate reports and analytics for administration",
                                    "Comply with legal obligations and prevent fraud",
                                ]}
                            />
                        </Clause>

                        <Clause num="04 / Security" title="How we protect it">
                            <List
                                items={[
                                    "Encryption of data in transit and at rest",
                                    "Role-based access controls",
                                    "Regular security audits",
                                    "Secure server infrastructure and backups",
                                    "Staff training on data protection",
                                ]}
                            />
                        </Clause>

                        <Clause num="05 / Sharing" title="Who sees it">
                            <p>
                                We do not sell, trade, or rent your personal information. We may share only under:
                            </p>
                            <List
                                items={[
                                    "Authorized administrators within your organization",
                                    "Legal requirements or processes",
                                    "Protection of rights, safety, or property",
                                    "Service providers under confidentiality",
                                    "Business transfers (with prior notice)",
                                ]}
                            />
                        </Clause>

                        <Clause num="06 / Your rights" title="What you can do">
                            <List
                                items={[
                                    "Access your personal data",
                                    "Correct inaccurate information",
                                    "Request deletion (subject to legal requirements)",
                                    "Object to processing",
                                    "Request data portability",
                                ]}
                            />
                        </Clause>

                        <Clause num="07 / Retention" title="How long we keep it">
                            <p>
                                We retain personal information only as long as necessary to fulfill the purposes outlined
                                here, unless a longer retention period is required or permitted by law.
                            </p>
                        </Clause>

                        <Clause num="08 / Changes" title="Updates to this policy">
                            <p>
                                We may update this policy periodically. Significant changes will be posted here along
                                with a revised "Last updated" date.
                            </p>
                        </Clause>

                        <Clause num="09 / Contact" title="Reach us">
                            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                <div>
                                    <dt className="lw-eyebrow">Email</dt>
                                    <dd className="font-mono text-sm text-ink-900 mt-1">privacy@lockerwise.com</dd>
                                </div>
                                <div>
                                    <dt className="lw-eyebrow">Phone</dt>
                                    <dd className="font-mono text-sm text-ink-900 mt-1">+1 (555) 123-4567</dd>
                                </div>
                                <div>
                                    <dt className="lw-eyebrow">Address</dt>
                                    <dd className="font-mono text-sm text-ink-900 mt-1">DraconX LLC · Dover, DE</dd>
                                </div>
                            </dl>
                        </Clause>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
