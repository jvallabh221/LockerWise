import React, { useState, useContext } from "react";
import { LockerContext } from "../context/LockerProvider";
import { Mail, Loader, BookOpen, Send, AlertTriangle } from "lucide-react";

const TechnicalIssueForm = () => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { handleTechnicalIssue } = useContext(LockerContext);

    const handleSubject = (e) => {
        setSubject(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await handleTechnicalIssue(subject, description, email);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center flex flex-col items-center gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Technical Issue Details
                </h2>
                <p className="text-sm text-gray-600">
                    Report any technical issues or problems with the system
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                        Email
                    </label>
                    <div className="relative flex-1">
                        <div className="flex items-center">
                            <Mail className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                placeholder="Email ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <label htmlFor="subject" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                        Subject
                    </label>
                    <div className="relative flex-1">
                        <div className="flex items-center">
                            <BookOpen className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                required
                                className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                placeholder="Subject"
                                value={subject}
                                onChange={handleSubject}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <label htmlFor="description" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                        Description
                    </label>
                    <div className="relative flex-1">
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows="4"
                            className="outline-none w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm resize-none"
                            placeholder="Describe the technical issue in detail..."
                            value={description}
                            onChange={handleDescription}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-black transition-colors shadow-md ${
                        loading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-gray-400 hover:bg-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                >
                    {loading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Reporting...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Submit Issue
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TechnicalIssueForm;

