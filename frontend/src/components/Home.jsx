import React from "react";
import { Shield, Key, Settings, Lock, Users, BarChart3, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashNav from "./DashNav";
 
const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col">
            <DashNav />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-8">
                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                Secure & Efficient
                                <div className="block bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent pb-4">
                                    Locker Management
                                </div>
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Streamline locker allocation, renewal, and issue tracking with our intuitive system designed for modern facilities.
                            </p>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                                <div className="text-sm text-gray-600 font-medium">Secure</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                                <div className="text-sm text-gray-600 font-medium">Available</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
                                <div className="text-sm text-gray-600 font-medium">Tracking</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl font-bold text-purple-600 mb-2">Easy</div>
                                <div className="text-sm text-gray-600 font-medium">Management</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LockerWise?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make locker management effortless and secure
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group relative p-8 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/30">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Advanced Security</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    State-of-the-art encryption and role-based access control ensure your locker data remains protected at all times.
                                </p>
                            </div>
                        </div>
 
                        <div className="group relative p-8 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/30">
                                    <Key className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Smart Access</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Real-time monitoring and automated notifications for seamless digital key management and locker assignments.
                                </p>
                            </div>
                        </div>
 
                        <div className="group relative p-8 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/30">
                                    <Settings className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Easy Management</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Intuitive dashboards and streamlined workflows enable effortless locker administration for all user roles.
                                </p>
                            </div>
                        </div>
                    </div>

                  
                </div>
            </section>
 
            {/* About Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">About LockerWise</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
                            LockerWise is a secure and efficient digital locker management system designed to streamline locker allocation, renewal, and issue tracking. With features like role-based access, automated notifications, and user-friendly dashboards, it ensures seamless management for admins, staff, and users alike.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Driving excellence in facility management with cutting-edge solutions since 2020.</span>
                        </div>
                    </div>
                </div>
            </section>
 
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="mb-4">
                        <span className="text-2xl font-bold text-white">LockerWise</span>
                    </div>
                    <p className="text-sm mb-6">© {new Date().getFullYear()} DraconX INC. All rights reserved.</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
                        <Link to="/contact-us" className="hover:text-white transition-colors cursor-pointer">Contact Us</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};
 
export default Home;