import { Outlet } from "react-router-dom";
import Sidebar1 from "../components/sidebar1";

export default function MemberLayout() {
  console.log("MemberLayout rendered");
  console.log("MemberPage rendered");

  return (
    <div className="flex">
      <Sidebar1 />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
