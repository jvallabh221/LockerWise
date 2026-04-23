import React, { useState, useContext } from "react";
import { Loader, User, Key, FolderPen, Mail, Shuffle, UserPlus, AlertTriangle, Phone } from "lucide-react";
import Layout from "./Layout";
import { AdminContext } from "../context/AdminProvider";

const AddSingleStaff = () => {
    const { addSingleStaff } = useContext(AdminContext);

    const [email, setEmail] = useState("");
    const [username, setUserName] = useState(null);
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState(null);
    const [role, setRole] = useState("Staff");
    const [loading, setLoading] = useState(false);
    const [randomPass, setRandomPass] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await addSingleStaff(username, role, email, randomPass, phone, gender);
        } catch (error) {
            //console.error(error);
            setError("Failed to add staff. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const randomPassGenerator  = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
        let pass = "";
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            pass += chars[randomIndex];
        }
        setRandomPass(pass);
    };    

    return (
        <Layout>
            <section className="flex flex-col items-center justify-center py-4 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <div className="text-center flex flex-col items-center gap-3 mb-6">
                        
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Add Staff
                        </h1>
                        <p className="text-sm text-gray-600">
                            Add a valuable staff member to our dedicated team
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role and Username in one row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <label htmlFor="role" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Role
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <User className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="role"
                                            name="role"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-gray-100"
                                            placeholder="Role"
                                            value={"Staff"}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="username" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Username
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <FolderPen className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Username"
                                            value={username || ""}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex items-center">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                Password
                            </label>
                            <div className="relative flex-1">
                                <div className="flex items-center">
                                    <Key className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="text"
                                        required
                                        className="pl-10 pr-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                        placeholder="Password"
                                        value={randomPass}
                                        onChange={(e) => setRandomPass(e.target.value)}
                                    />
                                    <Shuffle className="cursor-pointer absolute right-3 h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors z-10" onClick={() => randomPassGenerator()} />
                                </div>
                            </div>
                        </div>

                        {/* Gender and Phone in one row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center">
                                <label htmlFor="gender" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Gender
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <User className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <select
                                            id="gender"
                                            name="gender"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm bg-white"
                                            value={gender || ""}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select Gender
                                            </option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="number" className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">
                                    Phone
                                </label>
                                <div className="relative flex-1">
                                    <div className="flex items-center">
                                        <Phone className="absolute left-3 h-5 w-5 text-gray-500 z-10" />
                                        <input
                                            id="number"
                                            name="number"
                                            type="tel"
                                            required
                                            className="pl-10 outline-none w-full py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                                            placeholder="Phone number"
                                            value={phone || ""}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
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
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Add Staff
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default AddSingleStaff;
