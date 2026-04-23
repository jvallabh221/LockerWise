import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockerContext } from "../context/LockerProvider";
import { AdminContext } from "../context/AdminProvider";
import { Loader, Send } from "lucide-react";
import Layout from "./Layout";
import { PageShell, FormCard, FieldRow, FieldGrid, ErrorBanner, FormActions } from "./ui/FormShell";

const TechnicalIssue = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { handleTechnicalIssue } = useContext(LockerContext);
    const { getAllIssues } = useContext(AdminContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await handleTechnicalIssue(subject, description, email);
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
                title="Technical"
                italicTitle="issue."
                description="Report a problem with the LockerWise system itself — authentication, dashboards, or any other technical concern."
            >
                <FormCard num="Step 1" title="Issue details">
                    <form onSubmit={handleSubmit}>
                        <FieldGrid cols={2}>
                            <FieldRow label="Email" htmlFor="email" span={2}>
                                <input
                                    id="email"
                                    type="email"
                                    required
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
                                    placeholder="Describe the technical issue in detail…"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FieldRow>
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions align="between">
                            <Link
                                to="/issue_reporting"
                                className="text-sm font-medium text-brass-500 hover:text-brass-600 underline-offset-4 hover:underline"
                            >
                                Locker issue →
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

export default TechnicalIssue;
