import React, { useState, useContext } from "react";
import { LockerContext } from "../context/LockerProvider";
import { Loader, Send } from "lucide-react";
import { FormCard, FieldRow, FieldGrid, ErrorBanner, FormActions } from "./ui/FormShell";

const TechnicalIssueForm = () => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { handleTechnicalIssue } = useContext(LockerContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await handleTechnicalIssue(subject, description, email);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCard num="§ 02" title="Technical issue details">
            <p className="text-slate-600 text-sm mb-6 max-w-xl">
                Report technical problems with the LockerWise system itself — login, emails, dashboards, or anything else.
            </p>
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

                <FormActions>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {loading ? "Reporting" : "Submit issue"}
                    </button>
                </FormActions>
            </form>
        </FormCard>
    );
};

export default TechnicalIssueForm;
