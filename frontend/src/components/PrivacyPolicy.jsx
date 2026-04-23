import React from "react";
import { Shield, Lock, Eye, FileText, Database, UserCheck } from "lucide-react";
import DashNav from "./DashNav";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <DashNav />
            
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Shield className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-8">
                        
                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-purple-600" />
                                Introduction
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                At LockerWise, we are committed to protecting your privacy and ensuring the security of your personal information. 
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our locker 
                                management system.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Database className="h-6 w-6 text-purple-600" />
                                Information We Collect
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        We collect personal information that you provide directly to us, including:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                                        <li>Name and contact information (email, phone number)</li>
                                        <li>Employee ID and organizational details</li>
                                        <li>Account credentials and authentication data</li>
                                        <li>Locker assignment and usage history</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Usage Information</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        We automatically collect information about how you interact with our system, including:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                                        <li>Login timestamps and session data</li>
                                        <li>System access logs and activity records</li>
                                        <li>Device information and IP addresses</li>
                                        <li>Browser type and version</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Eye className="h-6 w-6 text-purple-600" />
                                How We Use Your Information
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We use the information we collect for the following purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>To provide, maintain, and improve our locker management services</li>
                                <li>To process locker assignments, renewals, and cancellations</li>
                                <li>To authenticate users and ensure system security</li>
                                <li>To send notifications and important updates about locker status</li>
                                <li>To generate reports and analytics for administrative purposes</li>
                                <li>To comply with legal obligations and prevent fraudulent activities</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Lock className="h-6 w-6 text-purple-600" />
                                Data Security
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We implement industry-standard security measures to protect your personal information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Role-based access controls and authentication protocols</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Secure server infrastructure and data backup systems</li>
                                <li>Employee training on data protection and privacy practices</li>
                            </ul>
                        </section>

                        {/* Data Sharing and Disclosure */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <UserCheck className="h-6 w-6 text-purple-600" />
                                Data Sharing and Disclosure
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>With authorized administrators and staff members within your organization</li>
                                <li>When required by law or to comply with legal processes</li>
                                <li>To protect our rights, privacy, safety, or property</li>
                                <li>With service providers who assist in operating our system (under strict confidentiality agreements)</li>
                                <li>In connection with a business transfer or merger (with prior notice)</li>
                            </ul>
                        </section>

                        {/* Your Rights */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                You have the following rights regarding your personal information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Access:</strong> Request access to your personal data</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                            </ul>
                        </section>

                        {/* Data Retention */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                                unless a longer retention period is required or permitted by law. Locker assignment records and usage history are typically 
                                retained for administrative and audit purposes.
                            </p>
                        </section>

                        {/* Changes to This Policy */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                                on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Email:</strong> privacy@lockerwise.com</p>
                                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                                <p><strong>Address:</strong> DraconX LLC, 123 Business Street, City, State 12345</p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

