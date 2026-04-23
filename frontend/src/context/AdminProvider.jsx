import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const { loginDetails } = useContext(AuthContext);

    const [staffs, setStaffs] = useState([]);
    const [addedStaffs, setAddedStaffs] = useState([]);
    const [staffDetails, setStaffDetails] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [staffSuccess, setStaffSuccess] = useState(false);
    const [staffDeleteSuccess, setStaffDeleteSuccess] = useState(false);
    const [editStaffSuccess, setEditStaffSuccess] = useState(false);
    const [lockerIssue, setLockerIssue] = useState([]);
    const [technicalIssue, setTechnicalIssue] = useState([]);
    const [lockerHistory, setLockerHistory] = useState(null);
    
    // Ref to prevent duplicate API calls
    const isFetchingRef = useRef(false);
    const lastFetchRef = useRef(null);

    const navigate = useNavigate();

    const getStaffs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/viewAllStaff`, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (res.status === 200) {
                const data = res.data.users;
                setStaffs(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addSingleStaff = async (name, role, email, password, phoneNumber, gender) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/addStaff`,
                {
                    name,
                    role,
                    email,
                    password,
                    phoneNumber,
                    gender,
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 201) {
                const data = res.data;
                setAddedStaffs(data);
                setStaffSuccess(true);
                await getStaffs(); // Reload staff data
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleStaffDetails = async (id) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/viewStaffDetails`,
                {
                    id,
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                const data = res.data;
                setStaffDetails(data);
                return;
                //navigate("/staff_management");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteStaff = async (id) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/removeStaff`,
                {
                    id,
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                setStaffDeleteSuccess(true);
                await getStaffs(); // Reload staff data
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteLocker = async (lockerNumber) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/locker/deleteLocker`,
                {
                    lockerNumber,
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                setDeleteSuccess(true);
                navigate("/dashboard");
                // Locker data refresh is handled by DeleteLocker component calling fetchAndCategorizeLockers
            }
        } catch (error) {
            console.error(error);
        }
    };

    const editStaffDetails = async (id, name, role, email, password, phoneNumber, gender) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/admin/editStaff`,
                {
                    id,
                    name,
                    role,
                    email,
                    password,
                    phoneNumber,
                    gender,
                },
                {
                    // withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                setEditStaffSuccess(true);
                await getStaffs(); // Reload staff data
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAllIssues = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/issue/getAllIssue`, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (res.status === 200) {
                const {data} = res.data;
                setLockerIssue(data.lockerIssue);
                setTechnicalIssue(data.technicalIssue);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateComment = async (id, comment) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issue/updateComment`,
                { id, comment },
                {   
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
    
            if (res.status === 200) {
                await getAllIssues(); // Reload issues data
            }
        } catch (error) {
            console.error(error);
        }
    };    

    const updateIssue = async (id) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issue/updateIssue`,
                {
                    id,
                    status: 'In Action',
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                await getAllIssues(); // Reload issues data
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resolveIssue = async (id) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/issue/resolveIssue`,
                {
                    id,
                    status: 'Resolved',
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                await getAllIssues(); // Reload issues data
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteIssue = async (id) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issue/deleteIssue`,
                {
                    id,
                },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                await getAllIssues(); // Reload issues data
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getLockerHistory = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/viewFullHistory`, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (res.status === 200) {
                const data = res.data;
                setLockerHistory(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clearHistory = async (clearStartDate, clearEndDate) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/clearHistory`,
                {clearStartDate, clearEndDate},
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                // Refresh history data to get updated list
                await getLockerHistory();
                return "History cleared successfully!";
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!loginDetails) {
            //console.log("User is not logged in. Skipping data fetch.");
            isFetchingRef.current = false;
            lastFetchRef.current = null;
            return;
        }
    
        // Prevent duplicate API calls - check if we're already fetching or if we just fetched
        const loginDetailsKey = loginDetails._id || loginDetails.email || 'default';
        const now = Date.now();
        
        if (isFetchingRef.current) {
            return;
        }
        
        // If we fetched recently (within 1 second) for the same user, skip
        if (lastFetchRef.current && lastFetchRef.current.key === loginDetailsKey && now - lastFetchRef.current.timestamp < 1000) {
            return;
        }
        
        isFetchingRef.current = true;
        lastFetchRef.current = { key: loginDetailsKey, timestamp: now };
    
        const fetchData = async () => {
            try {
                //console.log("Fetching data...");
                await getAllIssues();
                if(loginDetails.role === "Admin"){
                    await getLockerHistory();
                    await getStaffs();
                }
            } catch (error) {
                console.error("Error while fetching data:", error);
            } finally {
                isFetchingRef.current = false;
            }
        };
    
        fetchData();
    }, [loginDetails]);

    return (
        <AdminContext.Provider
            value={{
                updateComment,
                resolveIssue,
                updateIssue,
                deleteIssue,
                lockerIssue,
                technicalIssue,
                editStaffSuccess,
                setEditStaffSuccess,
                staffDeleteSuccess,
                setStaffDeleteSuccess,
                staffSuccess,
                setStaffSuccess,
                editStaffDetails,
                deleteSuccess,
                setDeleteSuccess,
                deleteLocker,
                staffs,
                addSingleStaff,
                handleStaffDetails,
                staffDetails,
                deleteStaff,
                lockerHistory,
                clearHistory,
                getLockerHistory,
                getAllIssues,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export default AdminProvider;
