import React, { useState, useEffect } from 'react';
import logo from '../assets/headbar/logo.png';
import bellIcon from '../assets/headbar/Bell.png';
import calendarIcon from '../assets/headbar/Calendar.png';
import chatIcon from '../assets/headbar/Chat.png';

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');

  // Fetch user account data
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      const res = await fetch('https://ffwpu-member-dir.up.railway.app/directory/accounts/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('API response:', data); // 🟢 check what this looks like

      if (Array.isArray(data)) {
        setUserName(data[0]?.name || '');
      } else {
        setUserName(data.name || '');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  fetchUser();
}, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://ffwpu-member-dir.up.railway.app/directory/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while logging out.');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300 h-[78px] px-4 md:px-8">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto w-full h-full">
        {/* Left Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 md:ml-[-5rem] mr-4" />
          <div className="flex flex-col">
            <h1 className="text-[10px] sm:text-sm md:text-base font-black text-[#064983] leading-tight">
              FAMILY FEDERATION FOR <br />
              WORLD PEACE AND <br />
              UNIFICATION
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 md:mr-[-5rem]">
          {/* Username as Modal Trigger */}
          <div
            className="relative flex items-center gap-2 text-sm font-normal text-[#064983] border border-black rounded-full px-3 py-1 bg-white hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <img src={logo} alt="User" className="w-6 h-6 rounded-full object-cover" />
            <span>{userName || 'Loading...'}</span>

            {/* Modal */}
            {showModal && (
              <div className="absolute left-1/2 top-full z-50 flex flex-col items-center"
                   style={{ transform: 'translateX(-50%)', marginTop: '8px' }}>
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white mb-[-2px]" />
                <div className="bg-white rounded-lg shadow-lg p-6 min-w-[250px] flex flex-col items-center">
                  <span className="mb-4 text-lg font-semibold text-[#064983]">Account</span>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded font-medium"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                  <button
                    className="mt-2 text-sm text-gray-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
