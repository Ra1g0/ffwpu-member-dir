import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSave, FaSpinner, FaCloudUploadAlt, FaCheck, FaTimes } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_BASE_PATH || 'https://ffwpu-member-dir.up.railway.app/directory';
const CLOUDINARY_UPLOAD_PRESET = 'members_uploads';
const CLOUDINARY_CLOUD_NAME = 'debx9uf7g';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

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
  const [personalInfo, setPersonalInfo] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const fileInputRef = useRef(null);

  // Editable states for each tab
  const [editAcademic, setEditAcademic] = useState([]);
  const [editFamily, setEditFamily] = useState([]);
  const [editPublicMission, setEditPublicMission] = useState([]);
  const [editWorkExp, setEditWorkExp] = useState([]);
  const [editTraining, setEditTraining] = useState([]);
  const [editQualifications, setEditQualifications] = useState([]);
  const [editAwards, setEditAwards] = useState([]);
  const [editDisciplinary, setEditDisciplinary] = useState([]);
  const [editSpecialNotes, setEditSpecialNotes] = useState([]);
  

  const tabConfig = {
    'Academic Background': {
      url: 'academic-background',
      state: editAcademic, 
      setter: setEditAcademic, 
      idKey: 'academic_record_id',
      columns: ['period', 'school', 'degree', 'graduation'],
      headers: ['Period', 'School', 'Major/Degree', 'Graduation']
    },
    'Family Details': {
      url: 'family-details',
      state: editFamily, 
      setter: setEditFamily, 
      idKey: 'family_member_id',
      columns: ['relation', 'name', 'birthday', 'blessing'],
      headers: ['Relation', 'Name', 'Birthday', 'Blessing']
    },
    'Public Mission Post Held': {
      url: 'public-mission-posts',
      state: editPublicMission, 
      setter: setEditPublicMission, 
      idKey: 'mission_id',
      columns: ['period','organization','final_position','department','description'],
      headers: ['Period','Organization','Final Position','Department','Description']
    },
    'Work Experience': {
      url: 'work-experience',
      state: editWorkExp, 
      setter: setEditWorkExp, 
      idKey: 'work_experience_id',
      columns: ['period','organization','position','description'],
      headers: ['Period','Organization','Position','Description']
    },
    'Training & Qualifications': {
      url: 'training-qualifications',
      state: editTraining, 
      setter: setEditTraining, 
      idKey: 'training_id',
      columns: ['title','year','location','description'],
      headers: ['Title','Year','Location','Description']
    },
    'Awards & Penalties': {
      awardsUrl: 'awards-recognitions',
      awardsState: editAwards, 
      awardsSetter: setEditAwards, 
      awardsIdKey: 'award_id',
      awardsColumns: ['title','year','organization','description'],
      awardsHeaders: ['Title','Year','Organization','Description'],
      penaltiesUrl: 'disciplinary-actions',
      penaltiesState: editDisciplinary, 
      penaltiesSetter: setEditDisciplinary, 
      penaltiesIdKey: 'penalty_id',
      penaltiesColumns: ['date', 'reason'],
      penaltiesHeaders: ['Date', 'Reason']
    },
    'Special Notes': {
      url: 'special-note',
      state: editSpecialNotes, 
      setter: setEditSpecialNotes, 
      idKey: 'note_id',
      columns: ['date_written', 'details'],
      headers: ['Date Written', 'Details']
    },
   
  };

  const fetchTabData = async (tab) => {
    const conf = tabConfig[tab];
    if (!conf) return;
    
    try {
      if (tab === 'Awards & Penalties') {
        const [awardsRes, penaltiesRes] = await Promise.all([
          axios.get(`${API_BASE}/members/${member.member_id}/${conf.awardsUrl}/`),
          axios.get(`${API_BASE}/members/${member.member_id}/${conf.penaltiesUrl}/`)
        ]);
        conf.awardsSetter(awardsRes.data);
        conf.penaltiesSetter(penaltiesRes.data);
      } else {
        const res = await axios.get(`${API_BASE}/members/${member.member_id}/${conf.url}/`);
        conf.setter(res.data);
      }
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  useEffect(() => {
    if (!isOpen || !member?.member_id) return;

    if (activeTab === 'Personal & Contact') {
      axios.get(`${API_BASE}/members/${member.member_id}/`)
        .then(res => {
          setPersonalInfo(res.data);
          setFormData(res.data);
        });
    } else {
      fetchTabData(activeTab);
    }
  }, [activeTab, member, isOpen]);

  const extractImagePath = (fullUrl) => {
    if (!fullUrl) return null;
    if (fullUrl.startsWith('image/upload')) return fullUrl;
    
    const parts = fullUrl.split(`/${CLOUDINARY_CLOUD_NAME}/image/upload/`);
    if (parts.length > 1) {
      return `image/upload/${parts[1]}`;
    }
    return null;
  };

  const getFullImageUrl = (path) => {
    if (!path) return "https://ui-avatars.com/api/?name=No+Photo";
    if (path.startsWith('http')) return path;
    return `${CLOUDINARY_BASE_URL}/${path.replace('image/upload/', '')}`;
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imagePath = extractImagePath(response.data.secure_url);
      setFormData(prev => ({ ...prev, profile_photo_url: imagePath }));
      return imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    await handleImageUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleTableInputChange = (tab, idx, key, value) => {
    const setterMap = {
      'Academic Background': setEditAcademic,
      'Family Details': setEditFamily,
      'Public Mission Post Held': setEditPublicMission,
      'Work Experience': setEditWorkExp,
      'Training & Qualifications': setEditTraining,
      'Qualifications': setEditQualifications,
      'Awards & Penalties': setEditAwards,
      'Disciplinary Actions': setEditDisciplinary,
      'Special Notes': setEditSpecialNotes,
      
    };
    
    const stateMap = {
      'Academic Background': editAcademic,
      'Family Details': editFamily,
      'Public Mission Post Held': editPublicMission,
      'Work Experience': editWorkExp,
      'Training & Qualifications': editTraining,
      'Qualifications': editQualifications,
      'Awards & Penalties': editAwards,
      'Disciplinary Actions': editDisciplinary,
      'Special Notes': editSpecialNotes,
      
    };
    
    const newRows = [...stateMap[tab]];
    newRows[idx] = { ...newRows[idx], [key]: value };
    setterMap[tab](newRows);
  };

  const handleUpdateRow = async (tab, row) => {
    let url = '';
    const conf = tabConfig[tab];
    
    if (!conf) {
      // Handle special cases
      switch (tab) {
        case 'Awards & Penalties':
          // This should be handled differently as it's a combined tab
          return;
        default:
          return;
      }
    }
    
    try {
      if (tab === 'Awards & Penalties') {
        // This tab is handled differently
        return;
      }
      
      await axios.put(`${API_BASE}/members/${member.member_id}/${conf.url}/${row[conf.idKey]}/update/`, row);
      alert('Updated!');
      await fetchTabData(tab);
    } catch {
      alert('Update failed!');
    }
  };

  const handleDeleteRow = async (tab, row) => {
    let url = '';
    const conf = tabConfig[tab];
    
    if (!conf) {
      // Handle special cases
      switch (tab) {
        case 'Awards & Penalties':
          // This should be handled differently as it's a combined tab
          return;
        default:
          return;
      }
    }
    
    try {
      if (tab === 'Awards & Penalties') {
        // This tab is handled differently
        return;
      }
      
      await axios.delete(`${API_BASE}/members/${member.member_id}/${conf.url}/${row[conf.idKey]}/delete/`);
      alert('Deleted!');
      await fetchTabData(tab);
    } catch {
      alert('Delete failed!');
    }
  };

  const handleAddRow = (tab) => {
    const emptyRows = {
      'Academic Background': { period: '', school: '', degree: '', graduation: '', isNew: true },
      'Family Details': { relation: '', name: '', birthday: '', blessing: '', isNew: true },
      'Public Mission Post Held': { period: '', organization: '', final_position: '', department: '', description: '', isNew: true },
      'Work Experience': { period: '', organization: '', position: '', description: '', isNew: true },
      'Training & Qualifications': { title: '', year: '', location: '', description: '', isNew: true },
      'Awards & Penalties': { title: '', year: '', organization: '', description: '', isNew: true },
      'Special Notes': { date_written: '', details: '', isNew: true },
      
    };
    
    const setterMap = {
      'Academic Background': setEditAcademic,
      'Family Details': setEditFamily,
      'Public Mission Post Held': setEditPublicMission,
      'Work Experience': setEditWorkExp,
      'Training & Qualifications': setEditTraining,
      'Awards & Penalties': setEditAwards,
      'Special Notes': setEditSpecialNotes,
   
    };
    
    setterMap[tab](prev => [...prev, emptyRows[tab]]);
  };

  const handleCreateRow = async (tab, row, idx) => {
    let url = '';
    const conf = tabConfig[tab];
    
    if (!conf) return;
    
    const payload = { ...row };
    delete payload.isNew;
    
    try {
      if (tab === 'Awards & Penalties') {
        // This tab is handled differently
        return;
      }
      
      await axios.post(`${API_BASE}/members/${member.member_id}/${conf.url}/create/`, payload);
      alert('Created!');
      
      // Remove the temporary row
      const setterMap = {
        'Academic Background': setEditAcademic,
        'Family Details': setEditFamily,
        'Public Mission Post Held': setEditPublicMission,
        'Work Experience': setEditWorkExp,
        'Training & Qualifications': setEditTraining,
        'Awards & Penalties': setEditAwards,
        'Special Notes': setEditSpecialNotes,
        
      };
      
      setterMap[tab](prev => prev.filter((_, i) => i !== idx));
      await fetchTabData(tab);
    } catch {
      alert('Create failed!');
    }
  };

  const handleRemoveUnsavedRow = (tab, idx) => {
    const setterMap = {
      'Academic Background': setEditAcademic,
      'Family Details': setEditFamily,
      'Public Mission Post Held': setEditPublicMission,
      'Work Experience': setEditWorkExp,
      'Training & Qualifications': setEditTraining,
      'Awards & Penalties': setEditAwards,
      'Special Notes': setEditSpecialNotes,
     
    };
    
    setterMap[tab](prev => prev.filter((_, i) => i !== idx));
  };

  const renderEditableTable = (headers, keys, rows, tab, idKey) => (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
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
                    type={key.toLowerCase().includes('date') || key.toLowerCase().includes('year') || key.toLowerCase().includes('birthday') ? 'date' : 'text'}
                    className={`border ${editRowId === row[idKey] ? 'border-blue-500' : 'border-gray-300'} rounded px-2 py-1 w-full`}
                    value={row[key] || ''}
                    onChange={e => handleTableInputChange(tab, rowIdx, key, e.target.value)}
                    disabled={!row.isNew && editRowId !== row[idKey]}
                  />
                </td>
              ))}
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex gap-2 justify-center items-center">
                  {row.isNew ? (
                    <>
                      <button
                        className="text-sm px-2 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
                        onClick={() => handleCreateRow(tab, row, rowIdx)}
                        title="Create"
                      >
                        <FaCheck className="text-xs" /> Create
                      </button>
                      <button
                        className="text-sm px-2 py-1 bg-red-600 text-white rounded-md flex items-center gap-1"
                        onClick={() => handleRemoveUnsavedRow(tab, rowIdx)}
                        title="Remove"
                      >
                        <FaTimes className="text-xs" /> Remove
                      </button>
                    </>
                  ) : (
                    <>
                      {editRowId === row[idKey] ? (
                        <>
                          <button
                            className="text-sm px-2 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
                            onClick={() => {
                              handleUpdateRow(tab, row);
                              setEditRowId(null);
                            }}
                            title="Save"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                          <button
                            className="text-sm px-2 py-1 bg-red-600 text-white rounded-md flex items-center gap-1"
                            onClick={() => setEditRowId(null)}
                            title="Cancel"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-sm px-2 py-1 bg-[#066DC7] text-white rounded-md flex items-center gap-1"
                            onClick={() => setEditRowId(row[idKey])}
                            title="Edit"
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
                        </>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-right">
        <button
          className="px-3 py-1 bg-[#245AD2] text-white rounded text-sm flex items-center gap-1"
          onClick={() => handleAddRow(tab)}
        >
          <FaPlus /> Add New
        </button>
      </div>
    </div>
  );

  const renderTabHeader = (title, buttonText, onAdd) => (
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm sm:text-base font-semibold">{title}</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-xs sm:text-sm"
        onClick={onAdd}
      >
        <FaPlus /> {buttonText}
      </button>
    </div>
  );

  const handleSaveAll = () => {
    setIsSaving(true);
    
    if (activeTab === 'Personal & Contact') {
      axios.put(`${API_BASE}/members/${member.member_id}/update/`, formData)
        .then(() => {
          setIsSaving(false);
          setEditMode(false);
          const shouldReload = window.confirm('Changes saved successfully! Would you like to refresh the page to see updates?');
          if (shouldReload) window.location.reload();
        })
        .catch(() => {
          setIsSaving(false);
          alert('Save failed!');
        });
      return;
    }

    setTimeout(() => {
      setIsSaving(false);
      const shouldReload = window.confirm('Changes saved successfully! Would you like to refresh the page to see updates?');
      if (shouldReload) window.location.reload();
    }, 1000);
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

        <div className="text-sm text-gray-800 space-y-2 pb-12">
          {activeTab === 'Personal & Contact' && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-16 px-4 sm:px-12">
              <div className="flex flex-col w-full sm:w-1/3 h-full">
                <div className="flex flex-col items-center sm:items-center text-center sm:text-left mt-10">
                  <div className="relative group">
                    <img
                      src={
                        formData?.profile_photo_url
                          ? getFullImageUrl(formData.profile_photo_url)
                          : "https://ui-avatars.com/api/?name=No+Photo"
                      }
                      alt="Profile"
                      className="w-32 h-32 sm:w-70 sm:h-70 rounded-full object-cover shadow mx-auto sm:mx-0 border-4 border-white"
                    />
                    {editMode && (
                      <>
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={triggerFileInput}
                        >
                          <FaCloudUploadAlt className="text-white text-2xl" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </>
                    )}
                  </div>
                  {isUploading && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Uploading image...
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 text-sm text-gray-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-bold mb-2 mt-2">Edit Personal and Contact Details</h2>
                  {!editMode ? (
                    <button
                      className="text-sm px-4 py-2 bg-[#066DC7] text-white rounded-md flex items-center gap-1"
                      onClick={() => setEditMode(true)}
                    >
                      <FaEdit className="text-xs" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="text-sm px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-1"
                        onClick={() => {
                          setIsSaving(true);
                          axios.put(`${API_BASE}/members/${member.member_id}/update/`, formData)
                            .then(() => {
                              setIsSaving(false);
                              setEditMode(false);
                              alert('Personal info updated!');
                            })
                            .catch(() => {
                              setIsSaving(false);
                              alert('Update failed!');
                            });
                        }}
                      >
                        {isSaving ? (
                          <FaSpinner className="animate-spin text-xs" />
                        ) : (
                          <FaCheck className="text-xs" />
                        )} Save
                      </button>
                      <button
                        className="text-sm px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-1"
                        onClick={() => setEditMode(false)}
                      >
                        <FaTimes className="text-xs" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'First Name', key: 'first_name' },
                    { label: 'Last Name', key: 'last_name' },
                    { label: 'Email', key: 'email' },
                    { label: 'Region', key: 'region' },
                    { label: 'Nation', key: 'nation' },
                    { label: 'Nationality', key: 'nationality' },
                    { label: 'Birthday', key: 'birthday', type: 'date' },
                    { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female'] },
                    { label: 'Department', key: 'department' },
                    { label: 'Organization', key: 'organization' },
                    { label: 'Current Post', key: 'currentPost' },
                    { label: 'Position Title', key: 'position' },
                    { label: 'Blessing', key: 'blessing' },
                    { label: 'Date of Joining', key: 'dateOfJoining', type: 'date' },
                    { label: 'Phone Number', key: 'phone_no' },
                    { label: 'Address', key: 'address' },
                  ].map(({ label, key, type, options }) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="w-40 font-semibold">{label}:</label>
                      {type === 'select' ? (
                        <select
                          className={`border ${editMode ? 'border-blue-500' : 'border-gray-300'} rounded px-2 py-1 w-full`}
                          value={formData[key] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                          disabled={!editMode}
                        >
                          <option value="">-- Select --</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type || 'text'}
                          className={`border ${editMode ? 'border-blue-500' : 'border-gray-300'} rounded px-2 py-1 w-full`}
                          value={formData[key] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                          disabled={!editMode}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Academic Background' && (
            <div className="w-full">
              {renderTabHeader('Academic Background', 'Add Academic', () => handleAddRow('Academic Background'))}
              {renderEditableTable(
                tabConfig['Academic Background'].headers,
                tabConfig['Academic Background'].columns,
                editAcademic,
                'Academic Background',
                'academic_record_id'
              )}
            </div>
          )}

          {activeTab === 'Family Details' && (
            <div className="w-full">
              {renderTabHeader('Family Details', 'Add Family Member', () => handleAddRow('Family Details'))}
              {renderEditableTable(
                tabConfig['Family Details'].headers,
                tabConfig['Family Details'].columns,
                editFamily,
                'Family Details',
                'family_member_id'
              )}
            </div>
          )}

          {activeTab === 'Public Mission Post Held' && (
            <div className="w-full">
              {renderTabHeader('Public Mission Post Held', 'Add Mission Post', () => handleAddRow('Public Mission Post Held'))}
              {renderEditableTable(
                tabConfig['Public Mission Post Held'].headers,
                tabConfig['Public Mission Post Held'].columns,
                editPublicMission,
                'Public Mission Post Held',
                'mission_id'
              )}
            </div>
          )}

          {activeTab === 'Work Experience' && (
            <div className="w-full">
              {renderTabHeader('Work Experience', 'Add Experience', () => handleAddRow('Work Experience'))}
              {renderEditableTable(
                tabConfig['Work Experience'].headers,
                tabConfig['Work Experience'].columns,
                editWorkExp,
                'Work Experience',
                'work_experience_id'
              )}
            </div>
          )}

          {activeTab === 'Training & Qualifications' && (
            <div className="w-full">
              {renderTabHeader('Training & Qualifications', 'Add Training', () => handleAddRow('Training & Qualifications'))}
              {renderEditableTable(
                tabConfig['Training & Qualifications'].headers,
                tabConfig['Training & Qualifications'].columns,
                editTraining,
                'Training & Qualifications',
                'training_id'
              )}
            </div>
          )}

          {activeTab === 'Awards & Penalties' && (
            <div className="w-full space-y-8">
              <div>
                {renderTabHeader('Awards', 'Add Award', () => handleAddRow('Awards & Penalties'))}
                {renderEditableTable(
                  tabConfig['Awards & Penalties'].awardsHeaders,
                  tabConfig['Awards & Penalties'].awardsColumns,
                  editAwards,
                  'Awards & Penalties',
                  'award_id'
                )}
              </div>
              <div>
                {renderTabHeader('Disciplinary Actions', 'Add Disciplinary Action', () => handleAddRow('Disciplinary Actions'))}
                {renderEditableTable(
                  tabConfig['Awards & Penalties'].penaltiesHeaders,
                  tabConfig['Awards & Penalties'].penaltiesColumns,
                  editDisciplinary,
                  'Disciplinary Actions',
                  'penalty_id'
                )}
              </div>
            </div>
          )}

          {activeTab === 'Special Notes' && (
            <div className="w-full">
              {renderTabHeader('Special Notes', 'Add Note', () => handleAddRow('Special Notes'))}
              {renderEditableTable(
                tabConfig['Special Notes'].headers,
                tabConfig['Special Notes'].columns,
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