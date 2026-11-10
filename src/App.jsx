import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const WorkLaneLanding = lazy(() => import("./pages/WorkLaneLanding"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const EmployeeLayout = lazy(() => import("./layouts/EmployeeLayout"));
const AdminLayout = lazy(() => import("./admin/layout/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const UserManagement = lazy(() => import("./admin/pages/UserManagement"));
const TaskAssignment = lazy(() => import("./admin/pages/TaskAssignment"));
const VerificationWorkflow = lazy(() => import("./admin/pages/VerificationWorkflow"));
const EarningsCalculation = lazy(() => import("./admin/pages/EarningsCalculation"));
const PerformanceReporting = lazy(() => import("./admin/pages/PerformanceReporting"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PerformanceReport = lazy(() => import("./pages/Performance"));
const MyTasks = lazy(() => import("./pages/MyTasks"));
const MyPoints = lazy(() => import("./pages/MyPoints"));
const DailyEarnings = lazy(() => import("./pages/DailyEarnings"));
const AvailableBalance = lazy(() => import("./pages/AvailableBalance"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SupportCenter = lazy(() => import("./pages/SupportCenter"));

function RequireAuth({ children }) {
  return localStorage.getItem("wd_user") ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  return localStorage.getItem("wd_admin") ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return <Suspense fallback={<div className="worklane-loading" aria-label="Loading WorkLane"><span>W</span></div>}>
    <Routes>
      <Route path="/" element={<WorkLaneLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth><EmployeeLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/points" element={<MyPoints />} />
        <Route path="/earnings" element={<DailyEarnings />} />
        <Route path="/balance" element={<AvailableBalance />} />
        <Route path="/history" element={<PaymentHistory />} />
        <Route path="/performance" element={<PerformanceReport />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<SupportCenter />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="tasks" element={<TaskAssignment />} />
        <Route path="verify" element={<VerificationWorkflow />} />
        <Route path="earnings" element={<EarningsCalculation />} />
        <Route path="reports" element={<PerformanceReporting />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>;
}

export default App;
