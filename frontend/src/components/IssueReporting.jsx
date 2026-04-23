import React, { useState } from "react";
import Layout from "./Layout";
import LockerIssueForm from "./LockerIssueForm";
import TechnicalIssueForm from "./TechnicalIssueForm";
import { AlertTriangle } from "lucide-react";

const IssueReporting = () => {
    const [issueType, setIssueType] = useState("");

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Report an Issue
                        </h1>
                        <p className="text-sm text-gray-600">
                            Select the type of issue you want to report
                        </p>
                    </div>

                    {/* Issue Type Selection */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <label htmlFor="issueType" className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">
                                Issue Type
                            </label>
                            <div className="relative flex-1">
                                <select
                                    id="issueType"
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="outline-none w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                >
                                    <option value="" disabled>
                                        Select Issue Type
                                    </option>
                                    <option value="locker">Locker Issue</option>
                                    <option value="technical">Technical Issue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Show selected form */}
                    {issueType === "locker" && <LockerIssueForm />}
                    {issueType === "technical" && <TechnicalIssueForm />}

                    {!issueType && (
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-800">
                                Please select an issue type from the dropdown above to continue.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default IssueReporting;

