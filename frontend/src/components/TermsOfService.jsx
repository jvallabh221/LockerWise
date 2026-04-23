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

const TermsOfService = () => {
    return (
        <div className="lw-page lw-grain min-h-screen flex flex-col">
            <DashNav />
            <section className="px-6 sm:px-10 lg:px-16 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="lw-eyebrow mb-3">Colophon / Terms</div>
                    <h1 className="font-display text-5xl sm:text-6xl text-ink-900 leading-[1]">
                        The agreement, <span className="italic">in writing.</span>
                    </h1>
                    <div className="lw-rule-brass w-20 mt-6" />
                    <p className="mt-5 text-slate-600 max-w-2xl leading-relaxed">
                        Terms of Service for LockerWise. Last updated{" "}
                        <span className="font-mono">
                            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                        .
                    </p>

                    <div className="mt-12 border border-ink-900/10 bg-white p-8 md:p-12">
                        <Clause num="01 / Agreement" title="Agreement to terms">
                            <p>
                                By accessing and using LockerWise, you agree to these Terms of Service. If you do not
                                agree, please do not use the service. These terms apply to administrators, staff, and
                                end users.
                            </p>
                        </Clause>

                        <Clause num="02 / Use" title="Use of service">
                            <p className="font-semibold text-ink-900">Eligibility</p>
                            <p>
                                You must be authorized by your organization. Provide accurate information and keep your
                                account up to date.
                            </p>
                            <p className="font-semibold text-ink-900 mt-4">Account security</p>
                            <List
                                items={[
                                    "Keep your password confidential",
                                    "Report unauthorized access immediately",
                                    "Do not share your account",
                                    "Log out after each session",
                                ]}
                            />
                        </Clause>

                        <Clause num="03 / Acceptable use" title="What's not allowed">
                            <List
                                items={[
                                    "Illegal or unauthorized use",
                                    "Unauthorized access attempts",
                                    "Disrupting service or servers",
                                    "Transmitting malware",
                                    "Automated access without permission",
                                    "Reverse engineering the service",
                                    "Violating laws or regulations",
                                ]}
                            />
                        </Clause>

                        <Clause num="04 / Lockers" title="Assignments and usage">
                            <p className="font-semibold text-ink-900">Assignment terms</p>
                            <List
                                items={[
                                    "Use assigned lockers for their intended purpose",
                                    "Maintain lockers in good condition",
                                    "Report issues or damages immediately",
                                    "Comply with renewal and cancellation policies",
                                ]}
                            />
                            <p className="font-semibold text-ink-900 mt-4">Prohibited items</p>
                            <p>
                                Illegal, hazardous, or prohibited items are not permitted. Violation may result in
                                immediate termination of access.
                            </p>
                        </Clause>

                        <Clause num="05 / IP" title="Intellectual property">
                            <p>
                                LockerWise, including design, features, and content, is owned by DraconX LLC. Do not
                                copy, modify, or distribute without written permission.
                            </p>
                        </Clause>

                        <Clause num="06 / Liability" title="Limitation of liability">
                            <List
                                items={[
                                    'Service provided "as is" without warranties',
                                    "No liability for indirect or consequential damages",
                                    "Total liability limited to amounts paid in the past 12 months",
                                    "Not responsible for items stored in lockers",
                                ]}
                            />
                        </Clause>

                        <Clause num="07 / Termination" title="Ending access">
                            <List
                                items={[
                                    "Violation of these Terms",
                                    "Fraudulent or illegal activity",
                                    "Non-payment (if applicable)",
                                    "Organization request",
                                ]}
                            />
                        </Clause>

                        <Clause num="08 / Changes" title="Updates to these terms">
                            <p>
                                We reserve the right to modify these terms. Significant changes will be notified. Continued
                                use after changes constitutes acceptance.
                            </p>
                        </Clause>

                        <Clause num="09 / Law" title="Governing law">
                            <p>
                                These Terms shall be governed by the laws of the jurisdiction in which DraconX LLC
                                operates.
                            </p>
                        </Clause>

                        <Clause num="10 / Contact" title="Reach us">
                            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                <div>
                                    <dt className="lw-eyebrow">Email</dt>
                                    <dd className="font-mono text-sm text-ink-900 mt-1">legal@lockerwise.com</dd>
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

export default TermsOfService;
