import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import DashNav from "./DashNav";

const Unauthorize = () => {
    return (
        <div className="lw-page lw-grain min-h-screen flex flex-col">
            <DashNav />
            <main className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-lg w-full border border-ink-100 bg-white rounded-xl shadow-paper p-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-error-500 text-white flex items-center justify-center">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div className="lw-section-num text-error-600">Access denied</div>
                    </div>
                    <h1 className="font-display text-4xl text-ink-900 leading-tight">
                        You don't have <span className="text-error-600">permission</span> to view this page.
                    </h1>
                    <div className="lw-rule-brass w-16 mt-5 mb-5" />
                    <p className="text-slate-600 leading-relaxed">
                        If you believe this is a mistake, please contact your administrator. Otherwise, return to the
                        dashboard and carry on with your day.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center px-5 py-2.5 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors"
                        >
                            Back to dashboard
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center px-5 py-2.5 bg-white text-ink-900 border border-ink-100 hover:bg-cream-200 hover:border-ink-200 font-medium text-sm rounded-md transition-colors"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Unauthorize;
