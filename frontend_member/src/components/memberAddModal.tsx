import React, { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_BASE = 'https://directorybackend-production.up.railway.app/directory';

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

const emptyRows = {
  'Academic Background': { period: '', school: '', degree: '', graduation: '', isNew: true },
  'Family Details': { relation: '', name: '', birthday: '', blessing: '', isNew: true },
  'Public Mission Post Held': { period: '', organization: '', final_position: '', department: '', description: '', isNew: true },
  'Work Experience': { period: '', organization_name: '', final_position: '', department: '', job_description: '', isNew: true },
  'Training & Qualifications': { type: '', name_of_course: '', period: '', organization: '', status: '', isNew: true },
  'Qualifications': { date_acquisition: '', name_qualification: '', remarks: '', isNew: true },
  'Awards': { date: '', type: '', description: '', organization: '', isNew: true },
  'Disciplinary Actions': { date: '', reason: '', isNew: true },
  'Special Notes': { date_written: '', details: '', isNew: true },
};

const MemberAddModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Personal & Contact');
  const [formData, setFormData] = useState({});
  const [memberId, setMemberId] = useState(null);

  // Tab states
  const [tabRows, setTabRows] = useState({
    'Academic Background': [],
    'Family Details': [],
    'Public Mission Post Held': [],
    'Work Experience': [],
    'Training & Qualifications': [],
    'Qualifications': [],
    'Awards': [],
    'Disciplinary Actions': [],
    'Special Notes': [],
  });

  // Personal tab input handler
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  function formatDate(value) {
    if (!value) return '';
    // value is usually yyyy-mm-dd from input[type="date"]
    const [yyyy, mm, dd] = value.split('-');
    return `${yyyy.slice(2)}/${mm}/${dd}`;
  }

  // In handleCreateMember, format date fields before POST
  const handleCreateMember = async () => {
    // List all date keys used in Personal & Contact
    const dateKeys = ['birthday', 'dateOfJoining'];
    const formattedData = { ...formData };
    dateKeys.forEach(key => {
      if (formattedData[key]) {
        formattedData[key] = formatDate(formattedData[key]);
      }
    });
    try {
      const res = await axios.post(`${API_BASE}/members/create/`, formattedData);
      setMemberId(res.data.member_id);
      alert('Member created! You can now add details in other tabs.');
    } catch {
      alert('Failed to create member!');
    }
  };

  // Add row for tab
  const handleAddRow = (tab) => {
    setTabRows(prev => ({
      ...prev,
      [tab]: [...prev[tab], { ...emptyRows[tab] }],
    }));
  };

  // Table input change
  const handleTableInputChange = (tab, idx, key, value) => {
    setTabRows(prev => {
      const newRows = [...prev[tab]];
      newRows[idx][key] = value;
      return { ...prev, [tab]: newRows };
    });
  };

  // In handleCreateRow, format date fields before POST
  const handleCreateRow = async (tab, row, idx) => {
    if (!memberId) return;
    let url = '';
    let payload = { ...row };
    delete payload.isNew;

    // Format date fields for each tab
    const tabDateKeys = {
      'Academic Background': [],
      'Family Details': ['birthday'],
      'Public Mission Post Held': [],
      'Work Experience': [],
      'Training & Qualifications': ['period'],
      'Qualifications': ['date_acquisition'],
      'Awards': ['date'],
      'Disciplinary Actions': ['date'],
      'Special Notes': ['date_written'],
    };
    (tabDateKeys[tab] || []).forEach(key => {
      if (payload[key]) {
        payload[key] = formatDate(payload[key]);
      }
    });

    switch (tab) {
      case 'Academic Background':
        url = `${API_BASE}/members/${memberId}/academic-background/create/`;
        break;
      case 'Family Details':
        url = `${API_BASE}/members/${memberId}/family-details/create/`;
        break;
      case 'Public Mission Post Held':
        url = `${API_BASE}/members/${memberId}/public-mission-posts/create/`;
        break;
      case 'Work Experience':
        url = `${API_BASE}/members/${memberId}/work-experiences/create/`;
        break;
      case 'Training & Qualifications':
        url = `${API_BASE}/members/${memberId}/training-courses/create/`;
        break;
      case 'Qualifications':
        url = `${API_BASE}/members/${memberId}/qualifications/create/`;
        break;
      case 'Awards':
        url = `${API_BASE}/members/${memberId}/awards-recognition/create/`;
        break;
      case 'Disciplinary Actions':
        url = `${API_BASE}/members/${memberId}/disciplinary-actions/create/`;
        break;
      case 'Special Notes':
        url = `${API_BASE}/members/${memberId}/special-note/create/`;
        break;
      default:
        return;
    }
    try {
      await axios.post(url, payload);
      alert('Created!');
      setTabRows(prev => ({
        ...prev,
        [tab]: prev[tab].filter((_, i) => i !== idx),
      }));
    } catch {
      alert('Create failed!');
    }
  };

  // Render table for each tab
  const renderEditableTable = (headers, keys, rows, tab) => (
    <table className="min-w-[700px] sm:min-w-full text-sm sm:text-base text-center bg-white border border-gray-200 rounded-md overflow-hidden">
      <thead className="bg-[#245AD2] text-white">
        <tr>
          {headers.map((head, idx) => (
            <th key={idx} className="px-4 py-2 whitespace-nowrap">{head}</th>
          ))}
          <th className="px-4 py-2 whitespace-nowrap">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx} className="border-t hover:bg-gray-100">
            {keys.map((key, colIdx) => (
              <td key={colIdx} className="px-4 py-2 whitespace-nowrap">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={row[key] || ''}
                  onChange={e => handleTableInputChange(tab, rowIdx, key, e.target.value)}
                  disabled={!memberId}
                />
              </td>
            ))}
            <td className="px-4 py-2 whitespace-nowrap">
              <div className="flex gap-2 justify-center items-center">
                <button
                  className="text-sm px-2 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
                  onClick={() => handleCreateRow(tab, row, rowIdx)}
                  title="Create"
                  disabled={!memberId}
                >
                  <FaPlus className="text-xs" /> Create
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Tab header renderer
  const renderTabHeader = (title, buttonText, onAdd) => (
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm sm:text-base">{title}</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-xs sm:text-sm"
        onClick={onAdd}
        disabled={!memberId}
      >
        <FaPlus /> {buttonText}
      </button>
    </div>
  );

  if (!isOpen) return null;

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

        <h2 className="border-b border-gray-300 text-lg sm:text-xl font-bold mb-2 mt-2">Add Member Profile</h2>

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
                    src="https://ui-avatars.com/api/?name=New+Member"
                    alt="Profile"
                    className="w-32 h-32 sm:w-70 sm:h-70 rounded-full object-cover shadow mx-auto sm:mx-0"
                  />
                </div>
              </div>
              <div className="flex-1 text-sm text-gray-800 space-y-2">
                <h2 className="text-lg sm:text-xl font-bold mb-2 mt-2">Personal and Contact Details</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Name', key: 'full_name' },
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
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCreateMember}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md"
                      disabled={!!memberId}
                    >
                      <FaPlus className="mr-1" /> Create Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Background */}
          {activeTab === 'Academic Background' && (
            <div className="w-full">
              {renderTabHeader('Academic Background', 'Add Academic', () => handleAddRow('Academic Background'))}
              {renderEditableTable(
                ['Period', 'School', 'Major/Degree', 'Graduation'],
                ['period', 'school', 'degree', 'graduation'],
                tabRows['Academic Background'],
                'Academic Background'
              )}
            </div>
          )}

          {/* Family Details */}
          {activeTab === 'Family Details' && (
            <div className="w-full">
              {renderTabHeader('Family Details', 'Add Family Member', () => handleAddRow('Family Details'))}
              {renderEditableTable(
                ['Relation', 'Name', 'Birthday', 'Blessing'],
                ['relation', 'name', 'birthday', 'blessing'],
                tabRows['Family Details'],
                'Family Details'
              )}
            </div>
          )}

          {/* Public Mission Post Held */}
          {activeTab === 'Public Mission Post Held' && (
            <div className="w-full">
              {renderTabHeader('Public Mission Post Held', 'Add Mission Post', () => handleAddRow('Public Mission Post Held'))}
              {renderEditableTable(
                ['Period', 'Organization', 'Final Position', 'Department', 'Description'],
                ['period', 'organization', 'final_position', 'department', 'description'],
                tabRows['Public Mission Post Held'],
                'Public Mission Post Held'
              )}
            </div>
          )}

          {/* Work Experience */}
          {activeTab === 'Work Experience' && (
            <div className="w-full">
              {renderTabHeader('Work Experience', 'Add Experience', () => handleAddRow('Work Experience'))}
              {renderEditableTable(
                ['Period', 'Organization Name', 'Final Position', 'Department', 'Job Description'],
                ['period', 'organization_name', 'final_position', 'department', 'job_description'],
                tabRows['Work Experience'],
                'Work Experience'
              )}
            </div>
          )}

          {/* Training & Qualifications */}
          {activeTab === 'Training & Qualifications' && (
            <div className="w-full">
              {renderTabHeader('Training Courses', 'Add Training', () => handleAddRow('Training & Qualifications'))}
              {renderEditableTable(
                ['Type', 'Name of Course', 'Period', 'Organization', 'Status'],
                ['type', 'name_of_course', 'period', 'organization', 'status'],
                tabRows['Training & Qualifications'],
                'Training & Qualifications'
              )}
              {renderTabHeader('Professional Qualifications', 'Add Qualification', () => handleAddRow('Qualifications'))}
              {renderEditableTable(
                ['Date of Acquisition', 'Name of Qualification', 'Remarks'],
                ['date_acquisition', 'name_qualification', 'remarks'],
                tabRows['Qualifications'],
                'Qualifications'
              )}
            </div>
          )}

          {/* Awards & Penalties */}
          {activeTab === 'Awards & Penalties' && (
            <div className="w-full space-y-8">
              <div>
                {renderTabHeader('Awards', 'Add Award', () => handleAddRow('Awards'))}
                {renderEditableTable(
                  ['Date', 'Type', 'Description', 'Organization'],
                  ['date', 'type', 'description', 'organization'],
                  tabRows['Awards'],
                  'Awards'
                )}
              </div>
              <div>
                {renderTabHeader('Disciplinary Actions', 'Add Disciplinary Action', () => handleAddRow('Disciplinary Actions'))}
                {renderEditableTable(
                  ['Date', 'Reason'],
                  ['date', 'reason'],
                  tabRows['Disciplinary Actions'],
                  'Disciplinary Actions'
                )}
              </div>
            </div>
          )}

          {/* Special Notes */}
          {activeTab === 'Special Notes' && (
            <div className="w-full">
              {renderTabHeader('Special Notes', 'Add Note', () => handleAddRow('Special Notes'))}
              {renderEditableTable(
                ['Date Written', 'Details'],
                ['date_written', 'details'],
                tabRows['Special Notes'],
                'Special Notes'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberAddModal;
