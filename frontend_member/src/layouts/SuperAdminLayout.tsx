import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function SuperAdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
