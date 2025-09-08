import { Outlet } from "react-router-dom"
import Sidebar1 from "../components/sidebar1" // adjust path if needed

export default function SuperAdminLayout() {
  return (
    <div className="flex">
      <Sidebar1 />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}
