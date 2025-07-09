import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

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

const MemberAddModal = ({ isOpen, onClose, member }) => {
  const [activeTab, setActiveTab] = useState('Personal & Contact');
    const [formData, setFormData] = useState({ ...member });
  
    const handleInputChange = (key, value) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };
  
    const handleSocialChange = (platform, value) => {
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [platform]: value,
        },
      }));
    };
  
    if (!isOpen) return null;
  
    const renderTableWithActions = (headers, rows) => (
      <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-center bg-white border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-[#245AD2] text-white">
          <tr>
            {headers.map((head, idx) => (
              <th key={idx} className="px-4 py-2 whitespace-nowrap">
                {head}
              </th>
            ))}
            <th className="px-4 py-2 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((cols, rowIdx) => (
            <tr key={rowIdx} className="border-t hover:bg-gray-100">
              {cols.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-2 whitespace-nowrap">
                  {col}
                </td>
              ))}
              <td className="px-4 py-2 whitespace-nowrap">
              <div className="flex justify-center items-center gap-2">
                <button className="text-sm px-2 py-1 bg-[#066DC7] text-white rounded-md flex items-center gap-1">
                  <FaEdit className="text-xs" />
  
                </button>
                <button className="text-sm px-2 py-1 bg-red-600 text-white rounded-md flex items-center gap-1">
                  <FaTrash className="text-xs" />
                 
                </button>
              </div>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  
    const renderTabHeader = (title, buttonText) => (
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm sm:text-base">{title}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-xs sm:text-sm">
          <FaPlus /> {buttonText}
        </button>
      </div>
    );
  
    return (
      <div
        className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] px-2 sm:px-4 flex justify-center items-start sm:items-center"
        onClick={onClose}
      >
        <div
          className="relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-lg w-full max-w-7xl shadow-xl border border-gray-300 mt-[100px] sm:mt-0 ml-0 sm:ml-[250px] overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
  
          <h2 className="border-b border-gray-300 text-lg sm:text-xl font-bold mb-2 mt-2">Edit Member Profile</h2>
  
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
  
          {/* Tab Content */}
          <div className="text-sm text-gray-800 space-y-2">
            {/* Personal & Contact */}
            {activeTab === 'Personal & Contact' && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-16 px-4 sm:px-12">
                <div className="flex flex-col w-full sm:w-1/3 h-full">
                  <div className="flex flex-col items-center sm:items-center text-center sm:text-left mt-10">
                    <img
                      src="https://ui-avatars.com/api/?name=John+Regory"
                      alt="Profile"
                      className="w-32 h-32 sm:w-70 sm:h-70 rounded-full object-cover shadow mx-auto sm:mx-0"
                    />
                  </div>
                </div>
  
                <div className="flex-1 text-sm text-gray-800 space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold mb-2 mt-2">Personal and Contact Details</h2>
                  <div className="space-y-2">
                    {[
                      { label: 'Name', key: 'name' },
                      { label: 'Email', key: 'email' },
                      { label: 'Region', key: 'region' },
                      { label: 'Nation', key: 'nation' },
                      { label: 'Nationality', key: 'nationality' },
                      { label: 'Birthday', key: 'birthday', type: 'date' },
                      { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                      { label: 'Department', key: 'department' },
                      { label: 'Organization', key: 'organization' },
                      { label: 'Current Post', key: 'currentPost' },
                      { label: 'Position Title', key: 'position' },
                      { label: 'Blessing', key: 'blessing' },
                      { label: 'Date of Joining', key: 'dateOfJoining', type: 'date' },
                      { label: 'Phone Number', key: 'phone' },
                      { label: 'Address', key: 'address' },
                    ].map(({ label, key, type, options }) => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="w-40 font-semibold">{label}:</label>
                        {type === 'select' ? (
                          <select
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            value={formData[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                          >
                            <option value="">-- Select --</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={type || 'text'}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            value={formData[key] || ''}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
  
            {/* Tab: Academic Background */}
            {activeTab === 'Academic Background' && (
              <div className="w-full">
                {renderTabHeader('Academic Background', 'Add Academic')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  {renderTableWithActions(
                    ['Period', 'School', 'Major/Degree', 'Graduation'],
                    [['2022–2026', 'Pamantasan ng Lungsod ng Maynila', 'BS Computer Science', '2026']]
                  )}
                </div>
              </div>
            )}
  
            {/* Tab: Family Details */}
            {activeTab === 'Family Details' && (
              <div className="w-full">
                {renderTabHeader('Family Details', 'Add Family')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  {renderTableWithActions(
                    ['Relation', 'Name', 'Date of Birth', 'Blessing'],
                    [['Spouse', 'Chrysler Ann Dejillo', 'October 21, 2002', '1st Gen Couple']]
                  )}
                </div>
              </div>
            )}
  
            {/* Tab: Public Mission Posts Held */}
            {activeTab === 'Public Mission Post Held' && (
              <div className="w-full">
                {renderTabHeader('Public Mission Posts Held', 'Add Mission')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  {renderTableWithActions(
                    ['Period', 'Organization Name', 'Final Position', 'Department', 'Description'],
                    [['2020–2022', 'Family Federation for World Peace and Unification', 'Example Position', 'Volunteer Management', 'Example Job Description']]
                  )}
                </div>
              </div>
            )}
  
            {/* Tab: Work Experience */}
            {activeTab === 'Work Experience' && (
              <div className="w-full">
                {renderTabHeader('Work Experience', 'Add Work')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  {renderTableWithActions(
                    ['Period', 'Organization Name', 'Final Position', 'Department', 'Description'],
                    [['2018–2022', 'Tech Solutions Inc.', 'Senior Software Engineer', 'Volunteer Management', 'Example Job Description']]
                  )}
                </div>
              </div>
            )}
  
            {/* Tab: Training & Qualifications */}
            {activeTab === 'Training & Qualifications' && (
              <div className="w-full">
                {renderTabHeader('Training Courses', 'Add Training')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 mb-8">
                  {renderTableWithActions(
                    ['Type', 'Name of Course', 'Period', 'Organization', 'Status'],
                    [['Certification', 'Advanced JavaScript', 'Jan. 2023 - Mar. 2023', 'Online University', 'Finished']]
                  )}
                </div>
                {renderTabHeader('Professional Qualifications', 'Add Qualification')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  {renderTableWithActions(
                    ['Date of Acquisition', 'Name of Qualification', 'Remarks'],
                    [['Jan. 2023 - Mar. 2023', 'Certified Kubernetes Administrator (CKA)', 'Valid until June 2023']]
                  )}
                </div>
              </div>
            )}
  
            {/* Tab: Awards & Penalties */}
            {activeTab === 'Awards & Penalties' && (
              <div className="w-full space-y-8">
                <div>
                  {renderTabHeader('Recognition & Awards', 'Add Award')}
                  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                    {renderTableWithActions(
                      ['Date', 'Type', 'Description', 'Organization'],
                      [['Dec. 15, 2022', 'Employee of the Year', 'Outstanding performance in Project Alpha', 'Tech Solutions Inc.']]
                    )}
                  </div>
                </div>
                <div>
                  {renderTabHeader('Disciplinary Actions/Penalties', 'Add Penalty')}
                  <div className="w-full mt-2 overflow-x-auto rounded-md border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400">
                    {renderTableWithActions(
                      ['Date', 'Reason'],
                      [['--', '--']]
                    )}
                  </div>
                </div>
              </div>
            )}
  
            {/* Tab: Special Notes */}
            {activeTab === 'Special Notes' && (
              <div className="w-full">
                {renderTabHeader('Special Notes', 'Add Note')}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  {renderTableWithActions(
                    ['Date Written', 'Details'],
                    [['--', '--']]
                  )}
                </div>
              </div>
            )}
          </div>
  
          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-6 border-t pt-4">
            <button
              onClick={() => {
                console.log('Saving...', formData);
                alert('Changes saved!');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default MemberAddModal;
