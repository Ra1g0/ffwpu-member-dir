import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function MemberLayout() {
  console.log("MemberLayout rendered");
  console.log("MemberPage rendered");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
