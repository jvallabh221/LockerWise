import React, { useState } from "react";
import Layout from "./Layout";
import LockerIssueForm from "./LockerIssueForm";
import TechnicalIssueForm from "./TechnicalIssueForm";
import { PageShell, FormCard, FieldRow, FieldGrid } from "./ui/FormShell";

const IssueReporting = () => {
    const [issueType, setIssueType] = useState("");

    return (
        <Layout>
            <PageShell
                eyebrow="Operations / Report"
                title="Report an"
                italicTitle="issue."
                description="Start by selecting the type of issue. The appropriate form will appear below."
            >
                <FormCard>
                    <FieldGrid cols={1}>
                        <FieldRow label="Issue type" htmlFor="issueType">
                            <select
                                id="issueType"
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className="lw-input"
                            >
                                <option value="" disabled>Select issue type</option>
                                <option value="locker">Locker issue</option>
                                <option value="technical">Technical issue</option>
                            </select>
                        </FieldRow>
                    </FieldGrid>

                    {!issueType && (
                        <div className="mt-6 border border-[var(--border)] bg-[var(--surface-2)] p-4">
                            <div className="lw-eyebrow mb-1">Awaiting selection</div>
                            <p className="text-sm text-slate-600">
                                Choose an issue type above to reveal the report form.
                            </p>
                        </div>
                    )}
                </FormCard>

                {issueType === "locker" && <LockerIssueForm />}
                {issueType === "technical" && <TechnicalIssueForm />}
            </PageShell>
        </Layout>
    );
};

export default IssueReporting;
