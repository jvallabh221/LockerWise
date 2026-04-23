import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, User, CheckCircle2 } from "lucide-react";
import DashNav from "./DashNav";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };



    const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contact/contactMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success && res.status === 200) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
    } else {
        const errorMessage = data.message || "Error sending message";
        alert(errorMessage);
    }
};


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <DashNav />
            
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <MessageSquare className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions or need assistance? We're here to help! Reach out to us through any of the channels below.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                                
                                <div className="space-y-6">
                                    {/* Email */}
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                            <p className="text-gray-600">support@draconx.com</p>
                                            <p className="text-gray-600">lockerwise@draconx.com</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                            <p className="text-gray-600">+1 (831)-216-8890</p>
                                            <p className="text-sm text-gray-500">Mon-Fri, 9:00 AM - 6:00 PM EST</p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                            <p className="text-gray-600">DraconX Inc.</p>
                                            <p className="text-gray-600">8 The Green Ste A</p>
                                            <p className="text-gray-600">Dover, Delaware</p>
                                            <p className="text-gray-600">United States of America, 19901</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-gray-50 rounded-xl border border-purple-100">
                                    <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                                        <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                                        <p><strong>Sunday:</strong> Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600">We'll get back to you as soon as possible.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User className="inline h-4 w-4 mr-2" />
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors outline-none"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Mail className="inline h-4 w-4 mr-2" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors outline-none"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors outline-none"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <MessageSquare className="inline h-4 w-4 mr-2" />
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors outline-none resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <Send className="h-5 w-5" />
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 bg-gradient-to-br from-purple-50 to-gray-50 rounded-3xl p-8 border border-purple-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">How quickly will I receive a response?</h3>
                                <p className="text-gray-600">We typically respond within 24-48 hours during business days.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Can I schedule a demo?</h3>
                                <p className="text-gray-600">Yes! Contact us to schedule a personalized demo of LockerWise.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Do you offer technical support?</h3>
                                <p className="text-gray-600">We provide comprehensive technical support for all our clients.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">What if I have an urgent issue?</h3>
                                <p className="text-gray-600">For urgent matters, please call our support line directly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;

