import React from "react";
import { createContext, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "./AuthProvider";

export const LockerContext = createContext();

const LockerProvider = ({ children }) => {
    const navigate = useNavigate();

    const { loginDetails } = useContext(AuthContext);
    
    // Ref to prevent duplicate API calls
    const isFetchingRef = useRef(false);
    const lastFetchRef = useRef(null);

    const [addedLocker, setAddedLocker] = useState(null);
    const [availableLockers, setAvailableLockers] = useState(null);
    const [assignedLockers, setAssignedLockers] = useState(null);
    const [allLockerDetails, setAllLockerDetails] = useState([]);
    const [expiredLockerDetails, setExpiredLockerDetails] = useState([]);
    const [availableLockerDetails, setAvailableLockerDetails] = useState([]);
    const [allocatedLockerDetails, setAllocatedLockerDetails] = useState([]);
    const [maintenanceLockerDetails, setMaintenanceLockerDetails] = useState([]);
    const [cancelLockers, setCancelLockers] = useState(null);
    const [lockerIssue, setLockerIssue] = useState(null);
    const [technicalIssue, setTechnicalIssue] = useState(null);
    const [renewLocker, setRenewLocker] = useState(null);
    const [expireIn7Days, setExpireIn7Days] = useState(null);
    const [expireIn1Day, setExpireIn1Day] = useState(null);
    const [assignSuccess, setAssignSuccess] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);
    const [lockerSuccess, setLockerSuccess] = useState(false);
    const [technicalSuccess, setTechnicalSuccess] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [addMulSuccess, setAddMulSuccess] = useState(false);
    const [isEditable, setIsEditable] = useState({
        halfMale: false,
        fullMale: false,
        halfFemale: false,
        fullFemale: false,
    });

    const [lockerPrices, setLockerPrices] = useState({
        halfMale: { threeMonths: 0, sixMonths: 0, twelveMonths: 0 },
        fullMale: { threeMonths: 0, sixMonths: 0, twelveMonths: 0 },
        halfFemale: { threeMonths: 0, sixMonths: 0, twelveMonths: 0 },
        fullFemale: { threeMonths: 0, sixMonths: 0, twelveMonths: 0 },
    });

    const getLockerPrice = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/locker/getLockerPrices`,
                {
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
    
            if (res.status === 200) {
                const lockerPricesData = res.data.data;
    
                // Map locker prices into the state
                lockerPricesData.forEach((locker) => {
                    const { LockerType, availableForGender, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month } = locker;
    
                    if (LockerType === 'half' && availableForGender === 'Male') {
                        setLockerPrices((prevPrices) => ({
                            ...prevPrices,
                            halfMale: {
                                threeMonths: LockerPrice3Month,
                                sixMonths: LockerPrice6Month,
                                twelveMonths: LockerPrice12Month,
                            },
                        }));
                    } else if (LockerType === 'full' && availableForGender === 'Male') {
                        setLockerPrices((prevPrices) => ({
                            ...prevPrices,
                            fullMale: {
                                threeMonths: LockerPrice3Month,
                                sixMonths: LockerPrice6Month,
                                twelveMonths: LockerPrice12Month,
                            },
                        }));
                    } else if (LockerType === 'half' && availableForGender === 'Female') {
                        setLockerPrices((prevPrices) => ({
                            ...prevPrices,
                            halfFemale: {
                                threeMonths: LockerPrice3Month,
                                sixMonths: LockerPrice6Month,
                                twelveMonths: LockerPrice12Month,
                            },
                        }));
                    } else if (LockerType === 'full' && availableForGender === 'Female') {
                        setLockerPrices((prevPrices) => ({
                            ...prevPrices,
                            fullFemale: {
                                threeMonths: LockerPrice3Month,
                                sixMonths: LockerPrice6Month,
                                twelveMonths: LockerPrice12Month,
                            },
                        }));
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching locker prices:", error.message);
        }
    };    

    const toggleEditable = (lockerType) => {
        setIsEditable((prevState) => ({
            ...prevState,
            [lockerType]: !prevState[lockerType],
        }));
    };

    const handleInputChange = (e, lockerType, duration) => {
        const newPrice = e.target.value.trim();

        if (!/^\d*\.?\d*$/.test(newPrice)) {
            console.error("Invalid input: Price must be a positive number.");
            return;
        }
        
        setLockerPrices((prevPrices) => ({
            ...prevPrices,
            [lockerType]: {
                ...prevPrices[lockerType],
                [duration]: newPrice,
            },
        }));
    };
    
    const saveLockerPrice = async (lockerType) => {
        const { threeMonths, sixMonths, twelveMonths } = lockerPrices[lockerType];
        const data = {
            LockerPrice3Month: parseInt(threeMonths, 10),
            LockerPrice6Month: parseInt(sixMonths, 10),
            LockerPrice12Month: parseInt(twelveMonths, 10),
            LockerType: lockerType.includes("half") ? "half" : "full",
            availableForGender: lockerType.includes("Male") ? "Male" : "Female",
        };

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/locker/updateMultipleLockerPrices`, data, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (response.status === 200) {
                await getLockerPrice(); // Reload locker prices
            }
        } catch (error) {
            console.error("An error occurred while updating locker price:", error);
        }
    };

    const addLocker = async (LockerType, LockerNumber, LockerCodeCombinations, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month, availableForGender, LockerSerialNumber) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/addSingleLocker`,
                { LockerType, LockerNumber, LockerCodeCombinations, LockerPrice3Month, LockerPrice6Month, LockerPrice12Month, availableForGender, LockerSerialNumber },
                {
                    // /withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 201) {
                const data = res.data;
                setAddedLocker(data);
                setAddSuccess(true);
                await fetchAndCategorizeLockers(); // Reload locker data
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const availableLocker = async (lockerType, employeeGender) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/locker/availableLocker`,
                { lockerType, employeeGender },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );
            if (res.status === 200) {
                const data = res.data;
                setAvailableLockers(data);
                // Navigation removed - form will show on same page when data is available
            }
        } catch (error) {
            throw "Selected Locker Criteria is not Available";
        }
    };

    const allocateLocker = async (lockerNumber, lockerType, lockerCode, employeeName, employeeId, employeeEmail, employeePhone, employeeGender, costToEmployee, duration, startDate, endDate) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/locker/allocateLocker`,
                {
                    lockerNumber,
                    lockerType,
                    lockerCode,
                    employeeName,
                    employeeId,
                    employeeEmail,
                    employeePhone,
                    employeeGender,
                    costToEmployee,
                    duration,
                    startDate,
                    endDate,
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
                setAssignedLockers(data);
                setAssignSuccess(true);
                await fetchAndCategorizeLockers(); // Reload locker data
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAndCategorizeLockers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locker/allLockers`, {
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            const data = res.data;
            if (res.status === 200) {
                const allLockers = data.data;
    
                // Categorize lockers based on their status
                const expiredLockers = allLockers.filter(locker => locker.LockerStatus === "expired");
                const availableLockers = allLockers.filter(locker => locker.LockerStatus === "available");
                const allocatedLockers = allLockers.filter(locker => locker.LockerStatus === "occupied");
                const maintenanceLockers = allLockers.filter(locker => locker.LockerStatus === "maintainance");
    
                // Update state for each category
                setAllLockerDetails(allLockers);
                setExpiredLockerDetails(expiredLockers);
                setAvailableLockerDetails(availableLockers);
                setAllocatedLockerDetails(allocatedLockers);
                setMaintenanceLockerDetails(maintenanceLockers);
            }
        } catch (error) {
            console.error(error);
        }
    };    

    const cancelLocker = async (lockerNumber, EmployeeEmail) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/locker/cancelLocker`,
                { lockerNumber, EmployeeEmail },
                {
                    // withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${loginDetails.token}`,
                    },
                }
            );

            if (res.status === 200) {
                const data = res.data;
                setCancelLockers(data);
                setCancelSuccess(true);
                await fetchAndCategorizeLockers(); // Reload locker data
                return data;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleLockerIssue = async (subject, description, LockerNumber, email) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issue/raiseLockerIssue`,
                {
                    subject,
                    description,
                    LockerNumber,
                    email,
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
                setLockerIssue(data);
                setLockerSuccess(true);
                // Caller (form component) will refetch issues and navigate
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTechnicalIssue = async (subject, description, email) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/issue/raiseTechnicalIssue`,
                {
                    subject,
                    description,
                    email,
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
                setTechnicalIssue(data);
                setTechnicalSuccess(true);
                // Caller (form component) will refetch issues and navigate
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleRenewLocker = async (lockerNumber, costToEmployee, duration, startDate, endDate, EmployeeEmail) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/locker/renewLocker`,
                {
                    lockerNumber,
                    costToEmployee,
                    duration,
                    startDate,
                    endDate,
                    EmployeeEmail,
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
                setRenewLocker(data);
                await fetchAndCategorizeLockers(); // Reload locker data
                navigate("/update_locker");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getExpiredLockers7Days = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locker/expiringIn7daysLockers`, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (res.status === 200) {
                const data = res.data;
                setExpireIn7Days(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getExpiredLockers1Day = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locker/expiringToday`, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },
            });
            if (res.status === 200) {
                const data = res.data;
                setExpireIn1Day(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditLockerDetails = async (LockerNumber, employeeName, employeePhone, employeeId, LockerCode) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/locker/editLockerDetails`, 
            {
                LockerDetails: { // Wrap all fields in LockerDetails
                    LockerNumber,
                    employeeName,
                    employeePhone,
                    employeeId,
                    LockerCode
                }
            }, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },

            });
            if (res.status === 200) {
                const data = res.data;
                await fetchAndCategorizeLockers(); // Reload locker data
                navigate("/locker_management");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const changeLockerStatus = async(LockerNumber,LockerStatus) =>{
        try {  
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/locker/changeLockerStatus`, 
            {
                LockerNumber,
                LockerStatus
            }, {
                // withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginDetails.token}`,
                },

            });
            if (res.status === 200) {
                const data = res.data;
                await fetchAndCategorizeLockers(); // Reload locker data
            }
        } catch (error) {
            console.error(error.message);
        }
    };

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
                await fetchAndCategorizeLockers();
                if (loginDetails.role === "Admin") {
                    await getExpiredLockers7Days();
                    await getExpiredLockers1Day();
                    await getLockerPrice();
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
        <LockerContext.Provider
            value={{
                expireIn1Day,
                addMulSuccess,
                setAddMulSuccess,
                expireIn7Days,
                handleTechnicalIssue,
                handleLockerIssue,
                allocatedLockerDetails,
                availableLockerDetails,
                expiredLockerDetails,
                maintenanceLockerDetails,
                allLockerDetails,
                cancelLocker,
                addLocker,
                availableLocker,
                availableLockers,
                setAvailableLockers,
                allocateLocker,
                handleRenewLocker,
                isEditable,
                lockerPrices,
                toggleEditable,
                handleInputChange,
                saveLockerPrice,
                assignSuccess,
                setAssignSuccess,
                cancelSuccess,
                setCancelSuccess,
                lockerSuccess,
                setLockerSuccess,
                technicalSuccess,
                setTechnicalSuccess,
                addSuccess,
                setAddSuccess,
                handleEditLockerDetails,
                changeLockerStatus,
                fetchAndCategorizeLockers,
            }}
        >
            {children}
        </LockerContext.Provider>
    );
};

export default LockerProvider;
