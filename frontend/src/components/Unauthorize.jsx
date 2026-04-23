import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import DashNav from "./DashNav";

const Unauthorize = () => {
    return (
        <div className="lw-page lw-grain min-h-screen flex flex-col">
            <DashNav />
            <main className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-lg w-full border border-ink-900/15 bg-white p-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#7a2a18] text-cream-50 flex items-center justify-center">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div className="lw-section-num text-[#7a2a18]">Access denied</div>
                    </div>
                    <h1 className="font-display text-4xl text-ink-900 leading-tight">
                        You don't have <span className="italic">permission</span> to view this page.
                    </h1>
                    <div className="lw-rule-brass w-16 mt-5 mb-5" />
                    <p className="text-slate-600 leading-relaxed">
                        If you believe this is a mistake, please contact your administrator. Otherwise, return to the
                        dashboard and carry on with your day.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center px-5 py-2.5 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors"
                        >
                            Back to dashboard
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center px-5 py-2.5 border border-ink-900 text-ink-900 font-mono text-xs uppercase tracking-editorial hover:bg-ink-900 hover:text-cream-50 transition-colors"
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
