import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Sidebar1() {
  const [isOpen, setIsOpen] = useState(false);

  const linkBase =
    "flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-full w-[184px] transition group";
  const activeStyles = "bg-[#064983] text-white";
  const inactiveStyles = "text-black hover:bg-[#064983] hover:text-white";

  return (
    <>
      {/* 🟢 Hamburger button (mobile only) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-[85px] left-4 z-[1000] bg-[#064983] text-white p-2 rounded-md shadow-md"
      >
        <FaBars size={18} />
      </button>

      {/* 🟢 Backdrop (when sidebar is open on mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-blue bg-opacity-0 z-[998] md:hidden"
        ></div>
      )}

      {/* 🟢 Sidebar */}
      <div
        className={`fixed top-[78px] left-0 w-[250px] h-[calc(100vh-78px)] bg-white p-4 shadow-md z-[999] transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Close button (mobile only) */}
        <div className="flex justify-end md:hidden mb-4">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={20} className="text-gray-600 hover:text-black" />
          </button>
        </div>

        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              onClick={() => setIsOpen(false)} // auto-close on mobile
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/member"
              onClick={() => setIsOpen(false)} // auto-close on mobile
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
              }
            >
              Members
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar1;
