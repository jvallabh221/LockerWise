import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Cookie } from "lucide-react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [loginDetails, setLoginDetails] = useState(JSON.parse(localStorage.getItem("loginDetails")) || null);
    const [getOtp, setGetOtp] = useState(null);
    const [validatedOtp, setValidatedOtp] = useState(null);
    const [resetedPassword, setResetedPassword] = useState(null);
    const [checkEmail, setCheckEmail] = useState(null);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (loginDetails) {
            localStorage.setItem("loginDetails", JSON.stringify(loginDetails));
        } else {
            localStorage.removeItem("loginDetails");
        }
    }, [loginDetails]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/login`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                const data = res.data;
                setLoginDetails(data);
                setLoginSuccess(true);
                navigate("/dashboard");
            }
        } catch (error) {
            throw error.response.data.error || "Invalid Username or Password";
        }
    };

    const generateOtp = async (email) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/resetPassword/getOtp`,
                { email },
            );

            if (res.status === 201) {
                const data = res.data;
                setGetOtp(data);
            }
            return res;
        } catch (error) {
            console.error(error);
        }
    };

    const validateOtp = async (email, otp) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/resetPassword/validateOTP`,
                { email, otp },
            );
            if (res.status === 200) {
                const data = res.data;
                setValidatedOtp(data);
            }
            return res;
        } catch (error) {
            throw new Error("Invalid OTP. Please try again.");
        }
    };

    const resetPassword = async (email, newPassword) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/resetPassword/resetPassword`,
                { email, newPassword },
                {
                    // withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 200) {
                const data = res.data;

                setResetedPassword(data);
                navigate("/login");
            }
        } catch (error) {
            console.error("reset password error - ",error);
        }
    };
    
    const logout = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/logOut`,
                {},
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                setLoginDetails(null);
                localStorage.removeItem("loginDetails");
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleProfileUpdate = async (userId, name, email, password, phone) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/profile/updateProfile`,
                {
                    userId,
                    name,
                    email,
                    password,
                    phone,
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                const data = res.data.data;

                setLoginDetails(data);
                localStorage.setItem("loginDetails", JSON.stringify(data));

                setUpdateSuccess(true);
                navigate("/dashboard");
                // Profile data is already updated in state, no need to reload
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePasswordChange = async (email,oldPassword,newPassword) =>{
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/profile/changePassword`,
                { email, oldPassword, newPassword },
                {
                    // withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                return "Password Updated Successfully";
            }
        } catch (error) {
            if(!error.response){
                return "Network Error. Please try again";
            }
            if (error.response.status === 404) {
                return "Invalid Email or Password";
            }
            return "An unexpected error occurred";
        }
    }

    return (
        <AuthContext.Provider
            value={{
                updateSuccess,
                setUpdateSuccess,
                setLoginSuccess,
                loginSuccess,
                handleProfileUpdate,
                handlePasswordChange,
                login,
                checkEmail,
                setCheckEmail,
                loginDetails,
                generateOtp,
                getOtp,
                validateOtp,
                resetPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
