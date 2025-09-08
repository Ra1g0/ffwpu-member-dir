import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://ffwpu-member-dir.up.railway.app/directory';

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
  const [academic, setAcademic] = useState([]);
  const [family, setFamily] = useState([]);
  const [publicMission, setPublicMission] = useState([]);
  const [work, setWork] = useState([]);
  const [training, setTraining] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [awards, setAwards] = useState([]);
  const [disciplinary, setDisciplinary] = useState([]);
  const [specialNotes, setSpecialNotes] = useState([]);
  const [memberDetails, setMemberDetails] = useState(null);

  useEffect(() => {
    if (!member?.member_id) return;

    // Fetch all members and find the selected member for Personal & Contact tab
    if (activeTab === 'Personal & Contact') {
      axios
        .get(`${API_BASE}/members/`)
        .then(res => {
          const found = res.data.find((m) => m.member_id === member.member_id);
          setMemberDetails(found || null);
        })
        .catch(err => console.error(err));
    }

    if (activeTab === 'Academic Background') {
      axios.get(`${API_BASE}/members/${member.member_id}/academic-background/`).then(res => setAcademic(res.data));
    }
    if (activeTab === 'Family Details') {
      axios.get(`${API_BASE}/members/${member.member_id}/family-details/`).then(res => setFamily(res.data));
    }
    if (activeTab === 'Public Mission Post Held') {
      axios.get(`${API_BASE}/members/${member.member_id}/public-mission-posts/`).then(res => setPublicMission(res.data));
    }
    if (activeTab === 'Work Experience') {
      axios.get(`${API_BASE}/members/${member.member_id}/work-experiences/`).then(res => setWork(res.data));
    }
    if (activeTab === 'Training & Qualifications') {
      axios.get(`${API_BASE}/members/${member.member_id}/training-courses/`).then(res => setTraining(res.data));
      axios.get(`${API_BASE}/members/${member.member_id}/qualifications/`).then(res => setQualifications(res.data));
    }
    if (activeTab === 'Awards & Penalties') {
      axios.get(`${API_BASE}/members/${member.member_id}/awards-recognition/`).then(res => setAwards(res.data));
      axios.get(`${API_BASE}/members/${member.member_id}/disciplinary-actions/`).then(res => setDisciplinary(res.data));
    }
    if (activeTab === 'Special Notes') {
      axios.get(`${API_BASE}/members/${member.member_id}/special-note/`).then(res => setSpecialNotes(res.data));
    }
  }, [activeTab, member]);

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
        onClick={e => e.stopPropagation()}
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
            {profileTabs.map(tab => (
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
              src={
                memberDetails?.profile_photo_url
                  ? `https://res.cloudinary.com/debx9uf7g/${memberDetails.profile_photo_url}`
                  : "https://ui-avatars.com/api/?name=No+Photo"
              }
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
                  <div className="flex"><strong className="w-40">Name:</strong><span>{memberDetails?.name || member?.full_name}</span></div>
                  <div className="flex"><strong className="w-40">Email:</strong><span>{memberDetails?.email || member?.email}</span></div>
                  <div className="flex"><strong className="w-40">Region:</strong><span>{memberDetails?.region || member?.region}</span></div>
                  <div className="flex"><strong className="w-40">Nation:</strong><span>{memberDetails?.nation || member?.nation}</span></div>
                  <div className="flex"><strong className="w-40">Nationality:</strong><span>{memberDetails?.nationality || 'Pilipino'}</span></div>
                  <div className="flex"><strong className="w-40">Birthday:</strong><span>{memberDetails?.birthday }</span></div>
                  <div className="flex"><strong className="w-40">Gender:</strong><span>{memberDetails?.gender || 'Male'}</span></div>
                  <div className="flex"><strong className="w-40">Department:</strong><span>{memberDetails?.department || member?.department}</span></div>
                </div>
              </div>

              {/* RIGHT - Organization Details */}
              <div className="flex-1 space-y-1">
                <div className="space-y-2 mt-0 sm:mt-9 mb-4">
                  <div className="flex"><strong className="w-40">Organization:</strong><span>{memberDetails?.organization || member?.organization}</span></div>
                  <div className="flex"><strong className="w-40">Current Post:</strong><span>{memberDetails?.current_post || 'Quezon City'}</span></div>
                  <div className="flex"><strong className="w-40">Position Title:</strong><span>{memberDetails?.position_title || 'Volunteer'}</span></div>
                  <div className="flex"><strong className="w-40">Blessing:</strong><span>{memberDetails?.blessing || '1st Gen'}</span></div>
                  <div className="flex"><strong className="w-40">Date of Joining:</strong><span>{memberDetails?.date_of_joining || '06/27/25'}</span></div>
                  <div className="flex"><strong className="w-40">Email:</strong><span>{memberDetails?.email || member?.email}</span></div>
                  <div className="flex"><strong className="w-40">Phone Number:</strong><span>{memberDetails?.phone_number || '09954487175'}</span></div>
                  <div className="flex flex-wrap break-words"><strong className="w-40">Address:</strong><span className="flex-1 break-words">{memberDetails?.address || 'Quezon City'}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Background */}
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
                  {academic.length > 0 ? academic.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.period}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.school}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.degree}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.graduation}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center py-4">No data</td></tr>
                  )}
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
                  {family.length > 0 ? family.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.relation}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.birthday}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.blessing}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Public Mission Post Held */}
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
                  {publicMission.length > 0 ? publicMission.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.period}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.organization_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.position}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.department}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.description}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Work Experience */}
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
                  {work.length > 0 ? work.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.period}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.organization_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.position}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.department}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.description}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Training & Qualifications */}
        {activeTab === 'Training & Qualifications' && (
          <div className="w-full">
            <p className="text-sm sm:text-base mb-4">Training Courses</p>
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
                  {training.length > 0 ? training.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.course_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.period}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.organization}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.status}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-sm sm:text-base mb-4">Professional Qualifications</p>
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
                  {qualifications.length > 0 ? qualifications.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.acquisition_date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.qualification_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.remarks}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Awards & Penalties */}
        {activeTab === 'Awards & Penalties' && (
          <div className="w-full">
            <p className="text-sm sm:text-base mb-4">Recognition & Awards</p>
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
                  {awards.length > 0 ? awards.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.description}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.organization}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
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
                  {disciplinary.length > 0 ? disciplinary.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.reason}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.action}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="text-center py-4">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Special Notes */}
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
                  {specialNotes.length > 0 ? specialNotes.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 whitespace-nowrap">{item.date_written}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.details}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={2} className="text-center py-4">No data</td></tr>
                  )}
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
