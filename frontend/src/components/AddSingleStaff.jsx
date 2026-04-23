import React, { useState, useContext } from "react";
import { Loader, UserPlus, Shuffle } from "lucide-react";
import Layout from "./Layout";
import { AdminContext } from "../context/AdminProvider";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

const AddSingleStaff = () => {
    const { addSingleStaff } = useContext(AdminContext);

    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [role] = useState("Staff");
    const [loading, setLoading] = useState(false);
    const [randomPass, setRandomPass] = useState("");
    const [error, setError] = useState("");

    const randomPassGenerator = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let p = "";
        for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
        setRandomPass(p);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await addSingleStaff(username, role, email, randomPass, phone, gender);
        } catch {
            setError("Failed to add staff. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Directory / Add"
                title="Add a"
                italicTitle="staff member."
                description="Create a new staff account. They'll receive credentials to sign in."
            >
                <FormCard>
                    <form onSubmit={handleSubmit}>
                        <div className="lw-eyebrow mb-4">01 / Identity</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Role" htmlFor="role">
                                <input id="role" type="text" readOnly value="Staff" className="lw-input" />
                            </FieldRow>
                            <FieldRow label="Username" htmlFor="username">
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    className="lw-input"
                                    placeholder="Display name"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </FieldRow>
                            <FieldRow label="Email" htmlFor="email" span={2}>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="off"
                                    className="lw-input"
                                    placeholder="name@organization.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FieldRow>
                        </FieldGrid>

                        <div className="lw-rule my-8" />
                        <div className="lw-eyebrow mb-4">02 / Contact</div>
                        <FieldGrid cols={2}>
                            <FieldRow label="Gender" htmlFor="gender">
                                <select id="gender" required value={gender} onChange={(e) => setGender(e.target.value)} className="lw-input">
                                    <option value="" disabled>Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </FieldRow>
                            <FieldRow label="Phone" htmlFor="number">
                                <input id="number" type="tel" required className="lw-input" placeholder="+1 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </FieldRow>
                        </FieldGrid>

                        <div className="lw-rule my-8" />
                        <div className="lw-eyebrow mb-4">03 / Initial password</div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <label htmlFor="password" className="lw-label">Password</label>
                                <input
                                    id="password"
                                    type="text"
                                    required
                                    className="lw-input font-mono"
                                    placeholder="Set or generate"
                                    value={randomPass}
                                    onChange={(e) => setRandomPass(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={randomPassGenerator}
                                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 border border-ink-100 text-slate-600 bg-white text-xs font-medium rounded-md hover:bg-cream-200 hover:text-ink-900 hover:border-ink-200 transition-colors"
                            >
                                <Shuffle className="w-3.5 h-3.5" />
                                Generate
                            </button>
                        </div>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brass-400 hover:bg-brass-500 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60"
                            >
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Adding</> : <><UserPlus className="w-4 h-4" /> Add staff</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default AddSingleStaff;
