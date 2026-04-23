import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TokenChecker = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    // Skip expiration check for the following routes
    const excludedRoutes = ["/login", "/forgot", "/reset", "/unauthorized", "/"];
    if (excludedRoutes.includes(location.pathname)) {
      return; // Skip token expiration check for these routes
    }

    const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    const auth_token = loginDetails?.token;
    if (auth_token) {
      const payload = JSON.parse(atob(auth_token.split(".")[1])); // Decoding the JWT
      const currentTime = Math.floor(Date.now() / 1000); // Current timestamp

      // Check if auth_token is expired
      if (payload.exp < currentTime) {
        alert("Your session has expired. Please log in again.");
        localStorage.clear(); // Clear the auth_token from localStorage
        navigate("/login"); // Redirect to login page
      }
    }
  }, [navigate, location.pathname]); // Re-run when the route changes

  return null; // This component does not render anything
};

export default TokenChecker;
