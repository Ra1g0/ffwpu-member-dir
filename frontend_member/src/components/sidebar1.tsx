import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

function Sidebar1() {
  const [isOpen, setIsOpen] = useState(false);

  const linkBase =
    'flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-full w-[184px] transition group';
  const activeStyles = 'bg-[#064983] text-white';
  const inactiveStyles = 'text-black hover:bg-[#064983] hover:text-white';

  return (
    <>
      {/* ✅ Slim White Background for Hamburger */}
      {!isOpen && (
        <div className="md:hidden fixed top-[78px] left-0 h-[calc(100vh-78px)] w-14 bg-white shadow-md z-[998] flex items-start px-2 pt-4">
          <button
            className="text-2xl text-black p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(true)}
          >
            <HiMenuAlt3 />
          </button>
        </div>
      )}

      {/* ✅ Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg z-[1000] p-4 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-black"
          >
            <HiX />
          </button>
        </div>

        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              onClick={() => setIsOpen(false)} // 👈 Closes drawer
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
              }
            >
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/superadmin"
              onClick={() => setIsOpen(false)} // 👈 Closes drawer
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
              }
            >
              <span>Members</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ✅ Desktop Sidebar (md and up) */}
      <div className="fixed top-[78px] left-0 w-[250px] h-[calc(100vh-78px)] bg-white p-4 shadow-md z-[999] hidden md:block">
        <div className="flex flex-col">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/superadmin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                <span>Members</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar1;
