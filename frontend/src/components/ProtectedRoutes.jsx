import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const {loginDetails} = useContext(AuthContext)

    if (!loginDetails) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(loginDetails.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoutes;
