import React, { useState, useEffect } from 'react';
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

const MemberEditModal = ({ isOpen, onClose, member }) => {
  const [activeTab, setActiveTab] = useState('Personal & Contact');
  const [formData, setFormData] = useState({ ...member });
  const [personalInfo, setPersonalInfo] = useState({}); // For showing info

  // Editable states for each tab
  const [editAcademic, setEditAcademic] = useState([]);
  const [editFamily, setEditFamily] = useState([]);
  const [editPublicMission, setEditPublicMission] = useState([]);
  const [editWork, setEditWork] = useState([]);
  const [editTraining, setEditTraining] = useState([]);
  const [editQualifications, setEditQualifications] = useState([]);
  const [editAwards, setEditAwards] = useState([]);
  const [editDisciplinary, setEditDisciplinary] = useState([]);
  const [editSpecialNotes, setEditSpecialNotes] = useState([]);

  useEffect(() => {
    if (!member?.member_id) return;
    // Fetch personal info for Personal & Contact tab
    if (activeTab === 'Personal & Contact') {
      axios.get(`${API_BASE}/members/${member.member_id}/`)
        .then(res => {
          setPersonalInfo(res.data);
          setFormData(res.data); // Sync formData with backend
        });
    }
    if (activeTab === 'Academic Background') {
      axios.get(`${API_BASE}/members/${member.member_id}/academic-background/`).then(res => setEditAcademic(res.data));
    }
    if (activeTab === 'Family Details') {
      axios.get(`${API_BASE}/members/${member.member_id}/family-details/`).then(res => setEditFamily(res.data));
    }
    if (activeTab === 'Public Mission Post Held') {
      axios.get(`${API_BASE}/members/${member.member_id}/public-mission-posts/`).then(res => setEditPublicMission(res.data));
    }
    if (activeTab === 'Work Experience') {
      axios.get(`${API_BASE}/members/${member.member_id}/work-experiences/`).then(res => setEditWork(res.data));
    }
    if (activeTab === 'Training & Qualifications') {
      axios.get(`${API_BASE}/members/${member.member_id}/training-courses/`).then(res => setEditTraining(res.data));
      axios.get(`${API_BASE}/members/${member.member_id}/qualifications/`).then(res => setEditQualifications(res.data));
    }
    if (activeTab === 'Awards & Penalties') {
      axios.get(`${API_BASE}/members/${member.member_id}/awards-recognition/`).then(res => setEditAwards(res.data));
      axios.get(`${API_BASE}/members/${member.member_id}/disciplinary-actions/`).then(res => setEditDisciplinary(res.data));
    }
    if (activeTab === 'Special Notes') {
      axios.get(`${API_BASE}/members/${member.member_id}/special-note/`).then(res => setEditSpecialNotes(res.data));
    }
  }, [activeTab, member]);

  // Generic handler for editing table cells
  const handleTableInputChange = (tab, idx, key, value) => {
    const setterMap = {
      'Academic Background': setEditAcademic,
      'Family Details': setEditFamily,
      'Public Mission Post Held': setEditPublicMission,
      'Work Experience': setEditWork,
      'Training & Qualifications': setEditTraining,
      'Qualifications': setEditQualifications,
      'Awards': setEditAwards,
      'Disciplinary Actions': setEditDisciplinary,
      'Special Notes': setEditSpecialNotes,
    };
    const stateMap = {
      'Academic Background': editAcademic,
      'Family Details': editFamily,
      'Public Mission Post Held': editPublicMission,
      'Work Experience': editWork,
      'Training & Qualifications': editTraining,
      'Qualifications': editQualifications,
      'Awards': editAwards,
      'Disciplinary Actions': editDisciplinary,
      'Special Notes': editSpecialNotes,
    };
    const newRows = [...stateMap[tab]];
    newRows[idx] = { ...newRows[idx], [key]: value };
    setterMap[tab](newRows);
  };

  // Update handler for each row
  const handleUpdateRow = (tab, row) => {
    let url = '';
    switch (tab) {
      case 'Academic Background':
        url = `${API_BASE}/members/${member.member_id}/academic-background/${row.academic_record_id}/update/`;
        break;
      case 'Family Details':
        url = `${API_BASE}/members/${member.member_id}/family-details/${row.family_member_id}/update/`;
        break;
      case 'Public Mission Post Held':
        url = `${API_BASE}/members/${member.member_id}/public-mission-posts/${row.mission_id}/update/`;
        break;
      case 'Work Experience':
        url = `${API_BASE}/members/${member.member_id}/work-experiences/${row.experience_id}/update/`;
        break;
      case 'Training & Qualifications':
        url = `${API_BASE}/members/${member.member_id}/training-courses/${row.training_id}/update/`;
        break;
      case 'Qualifications':
        url = `${API_BASE}/members/${member.member_id}/qualifications/${row.qualification_id}/update/`;
        break;
      case 'Awards':
        url = `${API_BASE}/members/${member.member_id}/awards-recognition/${row.award_id}/update/`;
        break;
      case 'Disciplinary Actions':
        url = `${API_BASE}/members/${member.member_id}/disciplinary-actions/${row.penalty_id}/update/`;
        break;
      case 'Special Notes':
        url = `${API_BASE}/members/${member.member_id}/special-note/${row.note_id}/update/`;
        break;
      default:
        return;
    }
    axios.put(url, row)
      .then(() => alert('Updated!'))
      .catch(() => alert('Update failed!'));
  };

  const handleDeleteRow = (tab, row) => {
    let url = '';
    switch (tab) {
      case 'Academic Background':
        url = `${API_BASE}/members/${member.member_id}/academic-background/${row.academic_record_id}/delete/`;
        break;
      case 'Family Details':
        url = `${API_BASE}/members/${member.member_id}/family-details/${row.family_member_id}/delete/`;
        break;
      case 'Public Mission Post Held':
        url = `${API_BASE}/members/${member.member_id}/public-mission-posts/${row.mission_id}/delete/`;
        break;
      case 'Work Experience':
        url = `${API_BASE}/members/${member.member_id}/work-experiences/${row.experience_id}/delete/`;
        break;
      case 'Training & Qualifications':
        url = `${API_BASE}/members/${member.member_id}/training-courses/${row.training_id}/delete/`;
        break;
      case 'Qualifications':
        url = `${API_BASE}/members/${member.member_id}/qualifications/${row.qualification_id}/delete/`;
        break;
      case 'Awards':
        url = `${API_BASE}/members/${member.member_id}/awards-recognition/${row.award_id}/delete/`;
        break;
      case 'Disciplinary Actions':
        url = `${API_BASE}/members/${member.member_id}/disciplinary-actions/${row.penalty_id}/delete/`;
        break;
      case 'Special Notes':
        url = `${API_BASE}/members/${member.member_id}/special-note/${row.note_id}/delete/`;
        break;
      default:
        return;
    }
    axios.delete(url)
      .then(() => alert('Deleted!'))
      .catch(() => alert('Delete failed!'));
  };

  // Editable table renderer
  const renderEditableTable = (headers, keys, rows, tab, idKey) => (
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
          <tr key={row[idKey] || rowIdx} className="border-t hover:bg-gray-100">
            {keys.map((key, colIdx) => (
              <td key={colIdx} className="px-4 py-2 whitespace-nowrap">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={row[key] || ''}
                  onChange={e => handleTableInputChange(tab, rowIdx, key, e.target.value)}
                />
              </td>
            ))}
            <td className="px-4 py-2 whitespace-nowrap">
              <div className="flex gap-2 justify-center items-center">
                <button
                  className="text-sm px-2 py-1 bg-[#066DC7] text-white rounded-md flex items-center gap-1"
                  onClick={() => handleUpdateRow(tab, row)}
                  title="Update"
                >
                  <FaEdit className="text-xs" />
                </button>
                <button
                  className="text-sm px-2 py-1 bg-red-600 text-white rounded-md flex items-center gap-1"
                  onClick={() => handleDeleteRow(tab, row)}
                  title="Delete"
                >
                  <FaTrash className="text-xs" />
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
      >
        <FaPlus /> {buttonText}
      </button>
    </div>
  );

  // Personal tab input handler
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save handler for Personal & Contact
  const handleSavePersonal = () => {
    axios.put(`${API_BASE}/members/${member.member_id}/update/`, formData)
      .then(() => alert('Personal info updated!'))
      .catch(() => alert('Update failed!'));
  };

  // Delete handler for Personal & Contact
  const handleDeletePersonal = () => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      axios.delete(`${API_BASE}/members/${member.member_id}/delete/`)
        .then(() => {
          alert('Member deleted!');
          onClose();
        })
        .catch(() => alert('Delete failed!'));
    }
  };

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
                    src={
                      personalInfo?.profile_photo_url
                        ? `https://res.cloudinary.com/debx9uf7g/${personalInfo.profile_photo_url}`
                        : "https://ui-avatars.com/api/?name=No+Photo"
                    }
                    alt="Profile"
                    className="w-32 h-32 sm:w-70 sm:h-70 rounded-full object-cover shadow mx-auto sm:mx-0"
                  />
                  
                </div>
              </div>
              <div className="flex-1 text-sm text-gray-800 space-y-2">
                <h2 className="text-lg sm:text-xl font-bold mb-2 mt-2">Edit Personal and Contact Details</h2>
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
                          onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
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
                          onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="text-sm px-4 py-2 bg-[#066DC7] text-white rounded-md flex items-center gap-1"
                      onClick={handleSavePersonal}
                    >
                      <FaEdit className="text-xs" /> Save
                    </button>
                    <button
                      className="text-sm px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-1"
                      onClick={handleDeletePersonal}
                    >
                      <FaTrash className="text-xs" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Background */}
          {activeTab === 'Academic Background' && (
            <div className="w-full">
              {renderTabHeader('Academic Background', 'Add Academic', () => {
                // Add your add logic here
              })}
              {renderEditableTable(
                ['Period', 'School', 'Major/Degree', 'Graduation'],
                ['period', 'school', 'degree', 'graduation'],
                editAcademic,
                'Academic Background',
                'academic_record_id'
              )}
            </div>
          )}

          {/* Family Details */}
          {activeTab === 'Family Details' && (
            <div className="w-full">
              {renderTabHeader('Family Details', 'Add Family Member', () => {
                // Add your add logic here
              })}
              {renderEditableTable(
                ['Relation', 'Name', 'Birthday', 'Blessing'],
                ['relation', 'name', 'birthday', 'blessing'],
                editFamily,
                'Family Details',
                'family_member_id'
              )}
            </div>
          )}

          {/* Public Mission Post Held */}
          {activeTab === 'Public Mission Post Held' && (
            <div className="w-full">
              {renderTabHeader('Public Mission Post Held', 'Add Mission Post', () => {
                // Add your add logic here
              })}
              {renderEditableTable(
                ['Period', 'Organization', 'Final Position', 'Department', 'Description'],
                ['period', 'organization', 'final_position', 'department', 'description'],
                editPublicMission,
                'Public Mission Post Held',
                'mission_id'
              )}
            </div>
          )}

          {/* Work Experience */}
          {activeTab === 'Work Experience' && (
            <div className="w-full">
              {renderTabHeader('Work Experience', 'Add Experience', () => {
                // Add your add logic here
              })}
              {renderEditableTable(
                ['Period', 'Organization Name', 'Final Position', 'Department', 'Job Description'],
                ['period', 'organization_name', 'final_position', 'department', 'job_description'],
                editWork,
                'Work Experience',
                'experience_id'
              )}
            </div>
          )}

          {/* Training & Qualifications */}
          {activeTab === 'Training & Qualifications' && (
          <div className="w-full">
            {/* Training Courses Section */}
            {renderTabHeader('Training Courses', 'Add Training', () => {
              // Add your add logic here
            })}
            {renderEditableTable(
              ['Type', 'Name of Course', 'Period', 'Organization', 'Status'],
              ['type', 'name_of_course', 'period', 'organization', 'status'],
              editTraining,
              'Training & Qualifications',
              'training_id'
            )}

            {/* Qualifications Section */}
            {renderTabHeader('Professional Qualifications', 'Add Qualification', () => {
              // Add your add logic here
            })}
            {renderEditableTable(
      ['Date of Acquisition', 'Name of Qualification', 'Remarks'],
      ['date_acquisition', 'name_qualification', 'remarks'],
      editQualifications,
      'Qualifications',
      'qualification_id'
    )}
  </div>
)}

          {/* Awards & Penalties */}
          {activeTab === 'Awards & Penalties' && (
            <div className="w-full space-y-8">
              <div>
                {renderTabHeader('Awards', 'Add Award', () => {
                  // Add your add logic here
                })}
                {renderEditableTable(
                  ['Date', 'Type', 'Description', 'Organization'],
                  ['date', 'type', 'description', 'organization'],
                  editAwards,
                  'Awards',
                  'award_id'
                )}
              </div>
              <div>
                {renderTabHeader('Disciplinary Actions', 'Add Disciplinary Action', () => {
                  // Add your add logic here
                })}
                {renderEditableTable(
                  ['Date', 'Reason'],
                  ['date', 'reason'],
                  editDisciplinary,
                  'Disciplinary Actions',
                  'penalty_id'
                )}
              </div>
            </div>
          )}

          {/* Special Notes */}
          {activeTab === 'Special Notes' && (
            <div className="w-full">
              {renderTabHeader('Special Notes', 'Add Note', () => {
                // Add your add logic here
              })}
              {renderEditableTable(
                ['Date Written', 'Details'],
                ['date_written', 'details'],
                editSpecialNotes,
                'Special Notes',
                'note_id'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberEditModal;
