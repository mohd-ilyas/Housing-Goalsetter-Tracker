import { lazy, Suspense, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import type { Role } from "../types";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Goals = lazy(() => import("../pages/Goals"));
const Approvals = lazy(() => import("../pages/Approvals"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Checkins = lazy(() => import("../pages/Checkins"));
const Admin = lazy(() => import("../pages/Admin"));
const Audit = lazy(() => import("../pages/Audit"));
const Escalations = lazy(() => import("../pages/Escalations"));

function ProtectedRoute({ children, roles }: { children: ReactElement; roles?: Role[] }) {
  const { currentUserId, users } = useAppStore();
  const user = users.find((item) => item.id === currentUserId);

  if (!currentUserId || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="route-loading">Loading AlignX...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/checkins" element={<ProtectedRoute roles={["employee", "manager"]}><Checkins /></ProtectedRoute>} />
        <Route path="/approvals" element={<ProtectedRoute roles={["manager", "admin"]}><Approvals /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute roles={["manager", "admin"]}><Analytics /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute roles={["admin"]}><Audit /></ProtectedRoute>} />
        <Route path="/escalations" element={<ProtectedRoute roles={["manager", "admin"]}><Escalations /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
