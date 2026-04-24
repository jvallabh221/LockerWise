import React from "react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthProvider from "./context/AuthProvider";
import LockerProvider from "./context/LockerProvider";
import AdminProvider from "./context/AdminProvider";
import IssueManagement from "./components/IssueManagement";
import ProtectedRoutes from "./components/ProtectedRoutes";
import TokenChecker from "./components/TokenChecker";


const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./components/Home"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const LockerManagement = lazy(() => import("./components/LockerManagement"));
const AddSingleLocker = lazy(() => import("./components/AddSingleLocker"));
const AvailableLockers = lazy(() => import("./components/AvailableLockers"));
const AssignLocker = lazy(() => import("./components/AssignLocker"));
const RenewLocker = lazy(() => import("./components/RenewLocker"));
const CancelLocker = lazy(() => import("./components/CancelLocker"));
const UpdateLocker = lazy(() => import("./components/UpdateLocker"));
const LockerIssue = lazy(() => import("./components/LockerIssue"));
const TechnicalIssue = lazy(() => import("./components/TechnicalIssue"));
const IssueReporting = lazy(() => import("./components/IssueReporting"));
const UpdateLockerFeature = lazy(() => import("./components/UpdateLockerFeature"));
const AddMultipleLocker = lazy(() => import("./components/AddMultipleLocker"));
const LockerAnalysis = lazy(() => import("./components/LockerAnalysis"));
const StaffManagement = lazy(() => import("./components/StaffManagement"));
const AddSingleStaff = lazy(() => import("./components/AddSingleStaff"));
const ViewStaffDetails = lazy(() => import("./components/ViewStaffDetails"));
const DeleteLocker = lazy(() => import("./components/DeleteLocker"));
const UpdateLockerPrice = lazy(() => import("./components/UpdateLockerPrice"));
const AccountPage = lazy(() => import("./components/AccountPage"));
const EditStaffDetails = lazy(() => import("./components/EditStaffDetails"));
const AccountResetPass = lazy(() => import("./components/AccountResetPass"));
const Unauthorize = lazy(() => import("./components/Unauthorize"))
const ViewReportStatus = lazy(()=> import("./components/ViewReportStatus"))
const LockerHistory = lazy(()=> import("./components/LockerHistory"))
const EditLockerDetails = lazy(()=> import("./components/EditLockerDetails"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const ContactUs = lazy(() => import("./components/ContactUs"));

const App = () => {
    return (
        <AuthProvider>
            <LockerProvider>
                <AdminProvider>
                    <Suspense fallback={<></>}>
                        <TokenChecker />
                        <Routes>
                            {/* PUBLIC ROUTES */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/forgot" element={<ForgotPassword />} />
                            <Route path="/reset" element={<ResetPassword />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-service" element={<TermsOfService />} />
                            <Route path="/contact-us" element={<ContactUs />} />
                            <Route path="/unauthorized" element={<Unauthorize />} />

                            {/* AUTHENTICATED ROUTES (Admin + Staff) */}
                            <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
                            <Route path="/account_page" element={<ProtectedRoutes><AccountPage /></ProtectedRoutes>} />
                            <Route path="/account_reset_pass" element={<ProtectedRoutes><AccountResetPass /></ProtectedRoutes>} />
                            <Route path="/locker_management" element={<ProtectedRoutes allowedRoles={["Admin", "Staff"]}><LockerManagement /></ProtectedRoutes>} />
                            <Route path="/editLockerDetails" element={<ProtectedRoutes allowedRoles={["Admin", "Staff"]}><EditLockerDetails /></ProtectedRoutes>} />
                            <Route path="/issue_reporting" element={<ProtectedRoutes allowedRoles={["Admin", "Staff"]}><IssueReporting /></ProtectedRoutes>} />
                            <Route path="/locker_issue" element={<ProtectedRoutes allowedRoles={["Admin", "Staff"]}><LockerIssue /></ProtectedRoutes>} />
                            <Route path="/technical_issue" element={<ProtectedRoutes allowedRoles={["Admin", "Staff"]}><TechnicalIssue /></ProtectedRoutes>} />

                            {/* ADMIN ROUTES */}
                            <Route path="/add_single_locker" element={<ProtectedRoutes allowedRoles="Admin"><AddSingleLocker /></ProtectedRoutes>} />
                            <Route path="/add_multiple_locker" element={<ProtectedRoutes allowedRoles="Admin"><AddMultipleLocker /></ProtectedRoutes>} />
                            <Route path="/delete_locker" element={<ProtectedRoutes allowedRoles="Admin"><DeleteLocker /></ProtectedRoutes>} />
                            <Route path="/update_locker_price" element={<ProtectedRoutes allowedRoles="Admin"><UpdateLockerPrice /></ProtectedRoutes>} />
                            <Route path="/locker_analysis" element={<ProtectedRoutes allowedRoles="Admin"><LockerAnalysis /></ProtectedRoutes>} />
                            <Route path="/locker_history" element={<ProtectedRoutes allowedRoles="Admin"><LockerHistory /></ProtectedRoutes>} />
                            <Route path="/issue_management" element={<ProtectedRoutes allowedRoles="Admin"><IssueManagement /></ProtectedRoutes>} />
                            <Route path="/staff_management" element={<ProtectedRoutes allowedRoles="Admin"><StaffManagement /></ProtectedRoutes>} />
                            <Route path="/add_single_staff" element={<ProtectedRoutes allowedRoles="Admin"><AddSingleStaff /></ProtectedRoutes>} />
                            <Route path="/view_staff_details" element={<ProtectedRoutes allowedRoles="Admin"><ViewStaffDetails /></ProtectedRoutes>} />
                            <Route path="/edit_staff_details" element={<ProtectedRoutes allowedRoles="Admin"><EditStaffDetails /></ProtectedRoutes>} />

                            {/* STAFF ROUTES */}
                            <Route path="/available_lockers" element={<ProtectedRoutes allowedRoles="Staff"><AvailableLockers /></ProtectedRoutes>} />
                            <Route path="/assign_locker" element={<ProtectedRoutes allowedRoles="Staff"><AssignLocker /></ProtectedRoutes>} />
                            <Route path="/renew_locker" element={<ProtectedRoutes allowedRoles="Staff"><RenewLocker /></ProtectedRoutes>} />
                            <Route path="/cancel_locker" element={<ProtectedRoutes allowedRoles="Staff"><CancelLocker /></ProtectedRoutes>} />
                            <Route path="/update_locker" element={<ProtectedRoutes allowedRoles="Staff"><UpdateLocker /></ProtectedRoutes>} />
                            <Route path="/update_locker_feature" element={<ProtectedRoutes allowedRoles="Staff"><UpdateLockerFeature /></ProtectedRoutes>} />
                            <Route path="/view_report_status" element={<ProtectedRoutes allowedRoles="Staff"><ViewReportStatus /></ProtectedRoutes>} />

                            {/* FALLBACK */}
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </Suspense>
                </AdminProvider>
            </LockerProvider>
        </AuthProvider>
    );
};

export default App;
