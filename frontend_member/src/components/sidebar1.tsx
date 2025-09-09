import { NavLink } from 'react-router-dom';

function Sidebar1() {
  const linkBase =
    'flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-full w-[184px] transition group';
  const activeStyles = 'bg-[#064983] text-white';
  const inactiveStyles = 'text-black hover:bg-[#064983] hover:text-white';

  return (
    <div className="fixed top-[78px] left-0 w-[250px] h-[calc(100vh-78px)] bg-white p-4 shadow-md z-[999]">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/superadmin"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyles : inactiveStyles}`
            }
          >
            Members
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar1;
