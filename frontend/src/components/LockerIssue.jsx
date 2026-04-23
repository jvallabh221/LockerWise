import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { AdminContext } from "../context/AdminProvider";
import { Loader, Send } from "lucide-react";
import Layout from "./Layout";
import { PageShell, FormCard, FieldRow, FieldGrid, ErrorBanner, FormActions } from "./ui/FormShell";

const LockerIssue = () => {
    const navigate = useNavigate();
    const [lockerNumber, setLockerNumber] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { handleLockerIssue } = useContext(LockerContext);
    const { getAllIssues } = useContext(AdminContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!/^\d*\.?\d*$/.test(lockerNumber)) {
            setError("Locker number must be a positive number.");
            return;
        }
        setLoading(true);
        try {
            await handleLockerIssue(subject, description, lockerNumber, email);
            try { if (getAllIssues) await getAllIssues(); } catch {}
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Report"
                title="Locker"
                italicTitle="issue."
                description="Report a problem with a specific locker. Include as much detail as you can."
            >
                <FormCard num="Step 1" title="Issue details">
                    <form onSubmit={handleSubmit}>
                        <FieldGrid cols={2}>
                            <FieldRow label="Locker number" htmlFor="number">
                                <input
                                    id="number"
                                    type="text"
                                    required
                                    className="lw-input"
                                    placeholder="e.g. 102"
                                    value={lockerNumber}
                                    onChange={(e) => setLockerNumber(e.target.value)}
                                />
                            </FieldRow>
                            <FieldRow label="Email" htmlFor="email">
                                <input
                                    id="email"
                                    type="email"
                                    className="lw-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                />
                            </FieldRow>
                            <FieldRow label="Subject" htmlFor="subject" span={2}>
                                <input
                                    id="subject"
                                    type="text"
                                    required
                                    className="lw-input"
                                    placeholder="Short summary"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </FieldRow>
                            <FieldRow label="Description" htmlFor="description" span={2}>
                                <textarea
                                    id="description"
                                    required
                                    rows={5}
                                    className="lw-input resize-none"
                                    placeholder="Describe the issue in detail…"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions align="between">
                            <Link
                                to="/technical_issue"
                                className="text-sm font-medium text-brass-500 hover:text-brass-600 underline-offset-4 hover:underline"
                            >
                                Technical issue →
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                            >
                                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {loading ? "Reporting" : "Submit issue"}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default LockerIssue;
