import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Mail, Key, Eye, EyeOff, Loader, AlertTriangle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoading(true);
        try {
            await login(email, password);
            setLoginError("");
        } catch (err) {
            setLoginError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center py-6 px-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10 min-h-[400px] flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center justify-center">

                    {/* LEFT SECTION */}
                    <div className="flex flex-col items-center justify-center text-center px-6 md:border-r md:border-gray-300 md:pr-10">
                        <img
                            src="/newNew.png"
                            alt="SafeLocker Logo"
                            className="h-40 w-40 mb-6 drop-shadow-xl transition-transform duration-300 hover:scale-110"
                        />

                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                            Locker Wise
                        </h1>

                        <p className="text-gray-600 mt-4 text-lg">
                            Secure access to your digital lockers
                        </p>

                        <p className="text-gray-500 text-base mt-3 max-w-md">
                            Manage your lockers efficiently with our advanced locker management platform.
                        </p>
                    </div>

                    {/* RIGHT SECTION - FORM */}
                    <div className="flex flex-col justify-center md:pl-10">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* EMAIL */}
                            <div className="flex items-center">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700 w-20">
                                    Email
                                </label>
                                <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                        id="email"
                                        type="email"
                                        required
                                        className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleEmail}
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="flex items-center">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-700 w-20">
                                    Password
                                </label>
                                <div className="relative flex-1">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                        id="password"
                                        type={showPassword ? "text" : "password" }
                                        required
                                        className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg 
                                        focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={handlePassword}
                                    />
                                    <button
                                        type="button"
                                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                       
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* ERROR */}
                            {loginError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    <p className="text-sm font-medium text-red-800">{loginError}</p>
                                </div>
                            )}

                            {/* FORGOT */}
                            <div className="flex items-center justify-end">
                                <Link
                                    to={"/forgot"}
                                    className="text-sm text-gray-600 hover:text-gray-700 hover:underline font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full 
                                font-semibold text-black transition-all shadow-md ${
                                    loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gray-400 hover:bg-gray-500 hover:shadow-lg"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
