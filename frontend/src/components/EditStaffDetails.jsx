import React, { useState, useContext, useRef } from "react";
import Layout from "./Layout";
import { Edit2, X, Save, Loader } from "lucide-react";
import { AdminContext } from "../context/AdminProvider";
import {
    PageShell,
    FormCard,
    FieldGrid,
    FieldRow,
    ErrorBanner,
    FormActions,
} from "./ui/FormShell";

const EditableField = ({ id, label, type = "text", value, onChange, editable, onToggle, inputRef, placeholder, span = 1, children }) => (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
        <label htmlFor={id} className="lw-label">{label}</label>
        <div className="flex items-end gap-2">
            {children ? (
                <div className="flex-1">{children}</div>
            ) : (
                <input
                    id={id}
                    ref={inputRef}
                    type={type}
                    readOnly={!editable}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="lw-input flex-1"
                    autoComplete="off"
                />
            )}
            <button
                type="button"
                onClick={onToggle}
                className="flex-shrink-0 w-9 h-9 border border-ink-900/15 bg-white hover:bg-ink-900 hover:text-cream-50 text-ink-900 transition-colors flex items-center justify-center"
                aria-label={editable ? "Cancel" : "Edit"}
            >
                {editable ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
        </div>
    </div>
);

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const EditStaffDetails = () => {
    const { staffDetails, editStaffDetails } = useContext(AdminContext);

    const [username, setUsername] = useState(staffDetails?.user?.name || "");
    const [email, setEmail] = useState(staffDetails?.user?.email || "");
    const [phone, setPhone] = useState(staffDetails?.user?.phoneNumber || "");
    const [gender, setGender] = useState(staffDetails?.user?.gender || "Male");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [uEdit, setUEdit] = useState(false);
    const [eEdit, setEEdit] = useState(false);
    const [pEdit, setPEdit] = useState(false);
    const [gEdit, setGEdit] = useState(false);
    const [pwdEdit, setPwdEdit] = useState(false);

    const refs = { u: useRef(), e: useRef(), p: useRef(), g: useRef(), pwd: useRef() };

    const toggle = (which, setter, state, ref) => {
        setter(!state);
        setTimeout(() => !state && ref.current?.focus(), 0);
    };

    const anyEdit = uEdit || eEdit || pEdit || gEdit || pwdEdit;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await editStaffDetails(staffDetails.user._id, username, staffDetails.user.role, email, password, phone, gender);
            setUEdit(false); setEEdit(false); setPEdit(false); setGEdit(false); setPwdEdit(false);
        } catch (err) {
            setError(typeof err === "string" ? err : "Failed to update.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <PageShell
                eyebrow="Directory / Edit"
                title="Edit"
                italicTitle="staff record."
                description="Review and update staff account information. Click the edit icon on a field to change it."
            >
                <FormCard>
                    <form onSubmit={handleSubmit}>
                        <div className="lw-eyebrow mb-4">Record</div>
                        <FieldGrid cols={2}>
                            <EditableField
                                id="username" label="Username"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                editable={uEdit} onToggle={() => toggle("u", setUEdit, uEdit, refs.u)}
                                inputRef={refs.u} placeholder="Display name"
                            />
                            <EditableField
                                id="email" label="Email" type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                editable={eEdit} onToggle={() => toggle("e", setEEdit, eEdit, refs.e)}
                                inputRef={refs.e} placeholder="name@organization.com"
                            />
                            <EditableField
                                id="phone" label="Phone"
                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                editable={pEdit} onToggle={() => toggle("p", setPEdit, pEdit, refs.p)}
                                inputRef={refs.p} placeholder="+1 ..."
                            />
                            <EditableField
                                id="gender" label="Gender"
                                editable={gEdit}
                                onToggle={() => toggle("g", setGEdit, gEdit, refs.g)}
                            >
                                {gEdit ? (
                                    <select ref={refs.g} className="lw-input w-full"
                                        value={GENDER_OPTIONS.includes(gender) ? gender : "Male"}
                                        onChange={(e) => setGender(e.target.value)}>
                                        {GENDER_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input readOnly className="lw-input w-full" value={gender} tabIndex={-1} />
                                )}
                            </EditableField>
                            <EditableField
                                id="password" label="New password" type="password" span={2}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                editable={pwdEdit} onToggle={() => toggle("pwd", setPwdEdit, pwdEdit, refs.pwd)}
                                inputRef={refs.pwd} placeholder="Leave empty to keep current"
                            />
                        </FieldGrid>

                        <ErrorBanner>{error}</ErrorBanner>

                        <FormActions>
                            <button
                                type="submit"
                                disabled={loading || !anyEdit}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-editorial hover:bg-ink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Updating</> : <><Save className="w-4 h-4" /> Save changes</>}
                            </button>
                        </FormActions>
                    </form>
                </FormCard>
            </PageShell>
        </Layout>
    );
};

export default EditStaffDetails;
