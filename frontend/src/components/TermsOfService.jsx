import React from "react";
import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Gavel } from "lucide-react";
import DashNav from "./DashNav";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <DashNav />
            
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Scale className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                        <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-8">
                        
                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-purple-600" />
                                Agreement to Terms
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing and using the LockerWise locker management system, you agree to be bound by these Terms of Service. 
                                If you do not agree to these terms, please do not use our service. These terms apply to all users, including 
                                administrators, staff members, and end users.
                            </p>
                        </section>

                        {/* Use of Service */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                                Use of Service
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Eligibility</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        You must be authorized by your organization to use LockerWise. You must provide accurate and complete 
                                        information when creating an account and keep your account information updated.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Security</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        You are responsible for maintaining the confidentiality of your account credentials. You agree to:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                                        <li>Keep your password secure and confidential</li>
                                        <li>Notify us immediately of any unauthorized access</li>
                                        <li>Not share your account with others</li>
                                        <li>Log out after each session</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Acceptable Use */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-purple-600" />
                                Acceptable Use Policy
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                You agree to use LockerWise only for lawful purposes and in accordance with these Terms. You agree NOT to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Use the service for any illegal or unauthorized purpose</li>
                                <li>Attempt to gain unauthorized access to the system or other users' accounts</li>
                                <li>Interfere with or disrupt the service or servers</li>
                                <li>Transmit any viruses, malware, or harmful code</li>
                                <li>Use automated systems to access the service without permission</li>
                                <li>Modify, adapt, or reverse engineer any part of the service</li>
                                <li>Violate any applicable laws or regulations</li>
                            </ul>
                        </section>

                        {/* Locker Assignments */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Locker Assignments and Usage</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Assignment Terms</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Locker assignments are subject to availability and organizational policies. You agree to:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                                        <li>Use assigned lockers only for their intended purpose</li>
                                        <li>Maintain the locker in good condition</li>
                                        <li>Report any issues or damages immediately</li>
                                        <li>Comply with renewal and cancellation policies</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Prohibited Items</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        You may not store illegal, hazardous, or prohibited items in assigned lockers. Violation of this policy 
                                        may result in immediate termination of locker access and account suspension.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Intellectual Property */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Gavel className="h-6 w-6 text-purple-600" />
                                Intellectual Property
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                The LockerWise service, including its design, features, and content, is owned by DraconX LLC and protected by 
                                intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our 
                                service without express written permission.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                To the maximum extent permitted by law:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>LockerWise is provided "as is" without warranties of any kind</li>
                                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                                <li>Our total liability shall not exceed the amount you paid for the service in the past 12 months</li>
                                <li>We are not responsible for loss or damage to items stored in lockers</li>
                            </ul>
                        </section>

                        {/* Termination */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <XCircle className="h-6 w-6 text-purple-600" />
                                Termination
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We may terminate or suspend your account and access to the service immediately, without prior notice, for:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Violation of these Terms of Service</li>
                                <li>Fraudulent or illegal activity</li>
                                <li>Non-payment of fees (if applicable)</li>
                                <li>At the request of your organization</li>
                            </ul>
                        </section>

                        {/* Changes to Terms */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes 
                                via email or through the service. Your continued use of LockerWise after changes become effective constitutes 
                                acceptance of the revised terms.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in 
                                which DraconX LLC operates, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Email:</strong> legal@lockerwise.com</p>
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

export default TermsOfService;

