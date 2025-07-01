import React from 'react';
import logo from '../assets/headbar/logo.png';
import bellIcon from '../assets/headbar/Bell.png';
import calendarIcon from '../assets/headbar/Calendar.png';
import chatIcon from '../assets/headbar/Chat.png';


function Header() {
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
          <img
            src={calendarIcon}
            alt="Calendar"
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:brightness-75 transition"
          /> 
           <img
            src={chatIcon}
            alt="Chat"
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:brightness-75 transition"
          /> 
           <img
            src={bellIcon}
            alt="Bell"
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:brightness-75 transition"
          />

          {/* Username */}
          <div className="flex items-center gap-2 text-sm font-normal text-[#064983] border border-black rounded-full px-3 py-1 bg-white">
            <img src={logo} alt="User" className="w-6 h-6 rounded-full object-cover" />
            <span>JohnRegory</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
