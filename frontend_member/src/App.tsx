import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./app/(private)/login/page";
import ForgotPassword from "./app/(private)/login/forgatpass/page";
import DashboardPage from "./app/(private)/dashboard/page";
import MemberPage from "./app/(private)/member/page";
import SuperAdminPage from "./app/(private)/superadmin/page";

import MemberLayout from "./layouts/MemberLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { isAuthenticated, permission } = useAuth();

  return (
    <Routes>
      {/* Redirect root */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? permission === "superadmin"
                  ? "/superadmin"
                  : "/member"
                : "/login"
            }
            replace
          />
        }
      />

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Shared Dashboard (if you want it visible to both) */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Member-only */}
      <Route element={<MemberLayout />}>
        <Route path="/member" element={<MemberPage />} />
      </Route>

      {/* Superadmin-only */}
      <Route element={<SuperAdminLayout />}>
        <Route path="/superadmin" element={<SuperAdminPage />} />
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? permission === "superadmin"
                  ? "/superadmin"
                  : "/member"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
