import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader } from "lucide-react";
import DashNav from "./DashNav";

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contact/contactMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success && res.status === 200) {
                setSubmitted(true);
                setFormData({ name: "", email: "", subject: "", message: "" });
                setTimeout(() => setSubmitted(false), 3500);
            } else {
                setError(data.message || "Error sending message");
            }
        } catch (err) {
            setError("Unable to send. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lw-page lw-grain min-h-screen flex flex-col">
            <DashNav />
            <section className="px-6 sm:px-10 lg:px-16 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="lw-eyebrow mb-3">Colophon / Contact</div>
                    <h1 className="font-display text-5xl sm:text-6xl text-ink-900 leading-[1]">
                        Write to us, <span className="text-brass-500">plainly.</span>
                    </h1>
                    <div className="lw-rule-brass w-20 mt-6" />
                    <p className="mt-5 text-slate-600 max-w-2xl leading-relaxed">
                        For demos, support, or policy questions — use the form, or reach us directly.
                    </p>

                    <div className="grid md:grid-cols-12 gap-8 mt-12">
                        {/* Left column */}
                        <div className="md:col-span-5 space-y-6">
                            <div className="border border-ink-900/10 bg-white p-8">
                                <div className="lw-eyebrow mb-6">01 / Direct lines</div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Mail className="w-5 h-5 text-ink-900 mt-0.5" />
                                        <div>
                                            <div className="lw-label">Email</div>
                                            <p className="font-mono text-sm text-ink-900">support@draconx.com</p>
                                            <p className="font-mono text-sm text-ink-900">lockerwise@draconx.com</p>
                                        </div>
                                    </div>
                                    <div className="lw-rule" />
                                    <div className="flex items-start gap-4">
                                        <Phone className="w-5 h-5 text-ink-900 mt-0.5" />
                                        <div>
                                            <div className="lw-label">Phone</div>
                                            <p className="font-mono text-sm text-ink-900">+1 (831) 216-8890</p>
                                            <p className="text-xs text-slate-500 mt-1">Mon–Fri · 9:00–18:00 EST</p>
                                        </div>
                                    </div>
                                    <div className="lw-rule" />
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-ink-900 mt-0.5" />
                                        <div>
                                            <div className="lw-label">Office</div>
                                            <p className="text-sm text-ink-900 leading-relaxed">
                                                DraconX Inc.<br />
                                                8 The Green Ste A<br />
                                                Dover, Delaware 19901<br />
                                                USA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-ink-900/10 bg-cream-50 p-8">
                                <div className="lw-eyebrow mb-4">02 / Hours</div>
                                <dl className="space-y-2 font-mono text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-slate-500">Mon – Fri</dt>
                                        <dd className="text-ink-900">09:00 – 18:00</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-slate-500">Saturday</dt>
                                        <dd className="text-ink-900">10:00 – 16:00</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-slate-500">Sunday</dt>
                                        <dd className="text-ink-900">Closed</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Right column — form */}
                        <div className="md:col-span-7 border border-ink-900/10 bg-white p-8 md:p-10">
                            <div className="lw-eyebrow mb-1">03 / Message</div>
                            <h2 className="font-display text-3xl text-ink-900 mb-8">Send us a note</h2>

                            {submitted ? (
                                <div className="py-10 text-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success-50 border border-success-500/25 text-success-600 mb-4">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-display text-2xl text-ink-900">Message sent</h3>
                                    <p className="text-slate-600 mt-1">We'll be in touch shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="lw-label">Name</label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Full name"
                                                className="lw-input"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="lw-label">Email</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@organization.com"
                                                className="lw-input"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="lw-label">Subject</label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="What is this about?"
                                            className="lw-input"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="lw-label">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className="lw-input resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <div className="border border-error-500/25 bg-error-50 text-error-700 rounded-lg px-3 py-2.5 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brass-400 hover:bg-brass-500 active:bg-brass-600 text-white font-medium text-sm rounded-md shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Sending
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-16 border border-ink-900/10 bg-cream-50 p-8 md:p-12">
                        <div className="lw-eyebrow mb-2">04 / FAQ</div>
                        <h2 className="font-display text-3xl text-ink-900 mb-8">Frequently asked</h2>
                        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                            <Faq q="How quickly will I receive a response?" a="Typically within 24–48 hours on business days." />
                            <Faq q="Can I schedule a demo?" a="Yes. Contact us and we'll arrange a personalized walkthrough." />
                            <Faq q="Do you offer technical support?" a="We provide comprehensive technical support for all clients." />
                            <Faq q="What if I have an urgent issue?" a="Call our support line directly for urgent matters." />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const Faq = ({ q, a }) => (
    <div className="border-t border-ink-900/10 pt-4">
        <h3 className="font-display text-lg text-ink-900">{q}</h3>
        <p className="text-slate-600 mt-1">{a}</p>
    </div>
);

export default ContactUs;
