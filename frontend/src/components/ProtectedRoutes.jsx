import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

/**
 * Route guard.
 *
 *  - No `allowedRoles` prop  → requires any authenticated user.
 *  - `allowedRoles="Admin"`  → requires that exact role.
 *  - `allowedRoles={["Admin","Staff"]}` → requires one of the listed roles.
 *
 * Unauthenticated visitors are sent to /login (carrying the attempted URL
 * as `location.state.from` so we can return them after a successful login).
 * Authenticated users with the wrong role are sent to /unauthorized.
 */
const ProtectedRoutes = ({ children, allowedRoles }) => {
    const { loginDetails } = useContext(AuthContext);
    const location = useLocation();

    if (!loginDetails) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(loginDetails.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoutes;
