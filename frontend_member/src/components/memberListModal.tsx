import React, { useState } from 'react';

const profileTabs = [
  'Personal & Contact',
  'Academic Background',
  'Family Details',
  'Public Mission Post Held',
  'Work Experience',
  'Training & Qualifications',
  'Awards & Penalties',
  'Special Notes',
];

const Modal = ({ isOpen, onClose, member }) => {
  const [activeTab, setActiveTab] = useState('Personal & Contact');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] px-2 sm:px-4 flex justify-center items-start sm:items-center"
      onClick={onClose}
    >
            <div
                className={`
                    relative z-10
                    bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-lg
                    w-full max-w-7xl
                    shadow-xl border border-gray-300
                    mt-[100px] sm:mt-0
                    ml-0 sm:ml-[250px]
                    overflow-y-auto sm:overflow-visible
                    max-h-[90vh] sm:max-h-none
                `}
                onClick={(e) => e.stopPropagation()}
                >
                {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
        

        {/* Header */}
        <h2 className="border-b border-gray-300 text-lg sm:text-xl font-bold mb-2 mt-2">Profile</h2>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-4 overflow-x-auto sm:overflow-visible">
        <ul className="flex flex-nowrap sm:flex-wrap gap-2 text-xs sm:text-sm font-medium w-max sm:w-auto">
            {profileTabs.map((tab) => (
            <li
                key={tab}
                className={`whitespace-nowrap cursor-pointer px-3 py-2 rounded-t-md ${
                activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
            >
                {tab}
            </li>
            ))}
        </ul>
        </div>
        {/* Personal & Contact */}
          {activeTab === 'Personal & Contact' && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-16 px-4 sm:px-12">
              <div className="flex flex-col w-full sm:w-1/3 h-full">
                <div className="flex flex-col items-center sm:items-center text-center sm:text-left">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Regory"
                    alt="Profile"
                    className="w-32 h-32 sm:w-70 sm:h-70 rounded-full object-cover shadow mx-auto sm:mx-0"
                  />
                </div>
              </div>

            {/* RIGHT SECTION */}
<div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-800 mt-4">
  {/* LEFT - Personal Details */}
  <div className="flex-1 space-y-1">
    <h2 className="text-lg sm:text-xl font-bold mb-2">Personal and Contact Details</h2>
    <div className="space-y-2">
      <div className="flex"><strong className="w-40">Name:</strong><span>{member?.name}</span></div>
      <div className="flex"><strong className="w-40">Email:</strong><span>{member?.email}</span></div>
      <div className="flex"><strong className="w-40">Region:</strong><span>{member?.region}</span></div>
      <div className="flex"><strong className="w-40">Nation:</strong><span>{member?.nation}</span></div>
      <div className="flex"><strong className="w-40">Nationality:</strong><span>Pilipino</span></div>
      <div className="flex"><strong className="w-40">Birthday:</strong><span>July 2, 2025</span></div>
      <div className="flex"><strong className="w-40">Gender:</strong><span>Male</span></div>
      <div className="flex"><strong className="w-40">Department:</strong><span>{member?.department}</span></div>
    </div>
  </div>

  {/* RIGHT - Organization Details */}
  <div className="flex-1 space-y-1">
    <div className="space-y-2 mt-0 sm:mt-9 mb-4">
      <div className="flex"><strong className="w-40">Organization:</strong><span>{member?.organization}</span></div>
      <div className="flex"><strong className="w-40">Current Post:</strong><span>Quezon City</span></div>
      <div className="flex"><strong className="w-40">Position Title:</strong><span>Volunteer</span></div>
      <div className="flex"><strong className="w-40">Blessing:</strong><span>1st Gen</span></div>
      <div className="flex"><strong className="w-40">Date of Joining:</strong><span>06/27/25</span></div>
      <div className="flex"><strong className="w-40">Email:</strong><span>johnregorymabaet@gmail.com</span></div>
      <div className="flex"><strong className="w-40">Phone Number:</strong><span>09954487175</span></div>
      <div className="flex flex-wrap break-words"><strong className="w-40">Address:</strong><span className="flex-1 break-words">Quezon City</span></div>
    </div>
  </div>
  </div>
  </div>

            
          )}
            
          {activeTab === 'Academic Background' && (
  <div className="w-full">
    <p className="text-sm sm:text-base mb-4">Academic Background</p>

    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
      <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[#245AD2] text-white">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Period</th>
            <th className="px-4 py-2 whitespace-nowrap">School</th>
            <th className="px-4 py-2 whitespace-nowrap">Major/Degree</th>
            <th className="px-4 py-2 whitespace-nowrap">Graduation</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-100">
            <td className="px-4 py-2 whitespace-nowrap">2022–2026</td>
            <td className="px-4 py-2 whitespace-nowrap">Pamantasan ng Lungsod ng Maynila</td>
            <td className="px-4 py-2 whitespace-nowrap">BS Computer Science</td>
            <td className="px-4 py-2 whitespace-nowrap">2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Family Details */}
{activeTab === 'Family Details' && (
  <div className="w-full">
    <p className="text-sm sm:text-base mb-4">Family Details</p>

    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
      <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[#245AD2] text-white">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Relation</th>
            <th className="px-4 py-2 whitespace-nowrap">Name</th>
            <th className="px-4 py-2 whitespace-nowrap">Date of Birth</th>
            <th className="px-4 py-2 whitespace-nowrap">Blessing</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-100">
            <td className="px-4 py-2 whitespace-nowrap">Spouse</td>
            <td className="px-4 py-2 whitespace-nowrap">Chrysler Ann Dejillo</td>
            <td className="px-4 py-2 whitespace-nowrap">October 21, 2002</td>
            <td className="px-4 py-2 whitespace-nowrap">1st Gen Couple</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
          )}

          {activeTab === 'Public Mission Post Held' && (
           <div className="w-full">
    <p className="text-sm sm:text-base mb-4">Public Mission Posts Held</p>

    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
      <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[#245AD2] text-white">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Period</th>
            <th className="px-4 py-2 whitespace-nowrap">Organization Name</th>
            <th className="px-4 py-2 whitespace-nowrap">Final Position</th>
            <th className="px-4 py-2 whitespace-nowrap">Department</th>
            <th className="px-4 py-2 whitespace-nowrap">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-100">
            <td className="px-4 py-2 whitespace-nowrap">2020–2022</td>
            <td className="px-4 py-2 whitespace-nowrap">Family Federation for World Peace and Unification</td>
            <td className="px-4 py-2 whitespace-nowrap">Example Position</td>
            <td className="px-4 py-2 whitespace-nowrap">Volunteer Management</td>
            <td className="px-4 py-2 whitespace-nowrap">Example Job Description</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
          )}

          {activeTab === 'Work Experience' && (
            <div className="w-full">
          <p className="text-sm sm:text-base mb-4">Work Experience</p>

          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
            <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-[#245AD2] text-white">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">Period</th>
                  <th className="px-4 py-2 whitespace-nowrap">Organization Name</th>
                  <th className="px-4 py-2 whitespace-nowrap">Final Position</th>
                  <th className="px-4 py-2 whitespace-nowrap">Department</th>
                  <th className="px-4 py-2 whitespace-nowrap">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap">2018–2022</td>
                  <td className="px-4 py-2 whitespace-nowrap">Tech Solutions Inc.</td>
                  <td className="px-4 py-2 whitespace-nowrap">Senior Software Engineer</td>
                  <td className="px-4 py-2 whitespace-nowrap">Volunteer Management</td>
                  <td className="px-4 py-2 whitespace-nowrap">Example Job Description</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          )}

          {activeTab === 'Training & Qualifications' && (
  <div className="w-full">
    <p className="text-sm sm:text-base mb-4">Training Courses</p>

    {/* First Table: Training Courses */}
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 mb-8">
      <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[#245AD2] text-white">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Type</th>
            <th className="px-4 py-2 whitespace-nowrap">Name of Course</th>
            <th className="px-4 py-2 whitespace-nowrap">Period</th>
            <th className="px-4 py-2 whitespace-nowrap">Organization</th>
            <th className="px-4 py-2 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-100">
            <td className="px-4 py-2 whitespace-nowrap">Certification</td>
            <td className="px-4 py-2 whitespace-nowrap">Advanced JavaScript</td>
            <td className="px-4 py-2 whitespace-nowrap">Jan. 2023 - Mar. 2023</td>
            <td className="px-4 py-2 whitespace-nowrap">Online University</td>
            <td className="px-4 py-2 whitespace-nowrap">Finished</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Second Table: Seminars Attended */}
    <p className="text-sm sm:text-base mb-4">Progessional Qualifications</p>

    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
      <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[#245AD2] text-white">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Date of Acquisition</th>
            <th className="px-4 py-2 whitespace-nowrap">Name of Qualification</th>
            <th className="px-4 py-2 whitespace-nowrap">Remarks</th>
           
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-100">
            <td className="px-4 py-2 whitespace-nowrap">Jan. 2023 - Mar. 2023</td>
            <td className="px-4 py-2 whitespace-nowrap">Certified Kubernetes Administrator (CKA)</td>
            <td className="px-4 py-2 whitespace-nowrap">Valid until June 2023</td>
            
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

          {activeTab === 'Awards & Penalties' && (
            <div className="w-full">
          <p className="text-sm sm:text-base mb-4">Recognition & Awards</p>

          {/* First Table: Training Courses */}
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 mb-8">
            <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-[#245AD2] text-white">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">Date</th>
                  <th className="px-4 py-2 whitespace-nowrap">Type</th>
                  <th className="px-4 py-2 whitespace-nowrap">Description</th>
                  <th className="px-4 py-2 whitespace-nowrap">Organization</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap">Dec. 15, 2022</td>
                  <td className="px-4 py-2 whitespace-nowrap">Employee of the Year</td>
                  <td className="px-4 py-2 whitespace-nowrap">Outstanding performance in Project Alpha</td>
                  <td className="px-4 py-2 whitespace-nowrap">Tech Solutions Inc.</td>
                 
                </tr>
              </tbody>
            </table>
          </div>

          {/* Second Table: Seminars Attended */}
          <p className="text-sm sm:text-base mb-4">Disciplinary Actions/Penalties</p>

          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
            <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-[#245AD2] text-white">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">Date</th>
                  <th className="px-4 py-2 whitespace-nowrap">Reason</th>
                  <th className="px-4 py-2 whitespace-nowrap">Action</th>
                
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap">--</td>
                  <td className="px-4 py-2 whitespace-nowrap">--</td>
                  <td className="px-4 py-2 whitespace-nowrap">--</td>
                  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          )}

          {activeTab === 'Special Notes' && (
            <div className="w-full">
          <p className="text-sm sm:text-base mb-4">Special Notes</p>

          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
            <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-left bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-[#245AD2] text-white">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">Date Written</th>
                  <th className="px-4 py-2 whitespace-nowrap">Details</th>
            
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap">--</td>
                  <td className="px-4 py-2 whitespace-nowrap">--</td>
          
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          )}
        </div>
      </div>
    
  );
};

export default Modal;
