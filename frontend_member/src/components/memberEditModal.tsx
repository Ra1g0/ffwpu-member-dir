import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSave, FaSpinner, FaCloudUploadAlt, FaCheck, FaTimes } from 'react-icons/fa';

const API_BASE = 'https://ffwpu-member-dir.up.railway.app/directory';
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
  const [editWork, setEditWork] = useState([]);
  const [editTraining, setEditTraining] = useState([]);
  const [editQualifications, setEditQualifications] = useState([]);
  const [editAwards, setEditAwards] = useState([]);
  const [editDisciplinary, setEditDisciplinary] = useState([]);
  const [editSpecialNotes, setEditSpecialNotes] = useState([]);

  useEffect(() => {
    if (!member?.member_id) return;
    
    if (activeTab === 'Personal & Contact') {
      axios.get(`${API_BASE}/members/${member.member_id}/`)
        .then(res => {
          setPersonalInfo(res.data);
          setFormData(res.data);
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
      .then(() => {
        alert('Updated!');
        setEditRowId(null);
      })
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

  const handleAddRow = (tab) => {
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
    switch (tab) {
      case 'Academic Background':
        setEditAcademic(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Family Details':
        setEditFamily(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Public Mission Post Held':
        setEditPublicMission(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Work Experience':
        setEditWork(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Training & Qualifications':
        setEditTraining(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Qualifications':
        setEditQualifications(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Awards':
        setEditAwards(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Disciplinary Actions':
        setEditDisciplinary(prev => [...prev, emptyRows[tab]]);
        break;
      case 'Special Notes':
        setEditSpecialNotes(prev => [...prev, emptyRows[tab]]);
        break;
      default:
        break;
    }
  };

  const handleCreateRow = (tab, row, idx) => {
    let url = '';
    let payload = { ...row };
    delete payload.isNew;
    switch (tab) {
      case 'Academic Background':
        url = `${API_BASE}/members/${member.member_id}/academic-background/create/`;
        break;
      case 'Family Details':
        url = `${API_BASE}/members/${member.member_id}/family-details/create/`;
        break;
      case 'Public Mission Post Held':
        url = `${API_BASE}/members/${member.member_id}/public-mission-posts/create/`;
        break;
      case 'Work Experience':
        url = `${API_BASE}/members/${member.member_id}/work-experiences/create/`;
        break;
      case 'Training & Qualifications':
        url = `${API_BASE}/members/${member.member_id}/training-courses/create/`;
        break;
      case 'Qualifications':
        url = `${API_BASE}/members/${member.member_id}/qualifications/create/`;
        break;
      case 'Awards':
        url = `${API_BASE}/members/${member.member_id}/awards-recognition/create/`;
        break;
      case 'Disciplinary Actions':
        url = `${API_BASE}/members/${member.member_id}/disciplinary-actions/create/`;
        break;
      case 'Special Notes':
        url = `${API_BASE}/members/${member.member_id}/special-note/create/`;
        break;
      default:
        return;
    }
    axios.post(url, payload)
      .then(() => {
        alert('Created!');
        switch (tab) {
          case 'Academic Background':
            setEditAcademic(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Family Details':
            setEditFamily(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Public Mission Post Held':
            setEditPublicMission(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Work Experience':
            setEditWork(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Training & Qualifications':
            setEditTraining(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Qualifications':
            setEditQualifications(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Awards':
            setEditAwards(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Disciplinary Actions':
            setEditDisciplinary(prev => prev.filter((_, i) => i !== idx));
            break;
          case 'Special Notes':
            setEditSpecialNotes(prev => prev.filter((_, i) => i !== idx));
            break;
          default:
            break;
        }
      })
      .catch(() => alert('Create failed!'));
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
                    type={key.toLowerCase().includes('date') ? 'date' : 'text'}
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
                    <button
                      className="text-sm px-2 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
                      onClick={() => handleCreateRow(tab, row, rowIdx)}
                      title="Create"
                    >
                      <FaPlus className="text-xs" /> Create
                    </button>
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
    </div>
  );

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
                    { label: 'Name', key: 'full_name' },
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
                ['Period', 'School', 'Major/Degree', 'Graduation'],
                ['period', 'school', 'degree', 'graduation'],
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
                ['Relation', 'Name', 'Birthday', 'Blessing'],
                ['relation', 'name', 'birthday', 'blessing'],
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
                ['Period', 'Organization', 'Final Position', 'Department', 'Description'],
                ['period', 'organization', 'final_position', 'department', 'description'],
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
                ['Period', 'Organization Name', 'Final Position', 'Department', 'Job Description'],
                ['period', 'organization_name', 'final_position', 'department', 'job_description'],
                editWork,
                'Work Experience',
                'experience_id'
              )}
            </div>
          )}

          {activeTab === 'Training & Qualifications' && (
            <div className="w-full">
              {renderTabHeader('Training Courses', 'Add Training', () => handleAddRow('Training & Qualifications'))}
              {renderEditableTable(
                ['Type', 'Name of Course', 'Period', 'Organization', 'Status'],
                ['type', 'name_of_course', 'period', 'organization', 'status'],
                editTraining,
                'Training & Qualifications',
                'training_id'
              )}
              {renderTabHeader('Professional Qualifications', 'Add Qualification', () => handleAddRow('Qualifications'))}
              {renderEditableTable(
                ['Date of Acquisition', 'Name of Qualification', 'Remarks'],
                ['date_acquisition', 'name_qualification', 'remarks'],
                editQualifications,
                'Qualifications',
                'qualification_id'
              )}
            </div>
          )}

          {activeTab === 'Awards & Penalties' && (
            <div className="w-full space-y-8">
              <div>
                {renderTabHeader('Awards', 'Add Award', () => handleAddRow('Awards'))}
                {renderEditableTable(
                  ['Date', 'Type', 'Description', 'Organization'],
                  ['date', 'type', 'description', 'organization'],
                  editAwards,
                  'Awards',
                  'award_id'
                )}
              </div>
              <div>
                {renderTabHeader('Disciplinary Actions', 'Add Disciplinary Action', () => handleAddRow('Disciplinary Actions'))}
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

          {activeTab === 'Special Notes' && (
            <div className="w-full">
              {renderTabHeader('Special Notes', 'Add Note', () => handleAddRow('Special Notes'))}
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

        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              className={`px-6 py-2 rounded-md shadow flex items-center gap-2 ${
                isSaving ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium transition-all`}
              onClick={handleSaveAll}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberEditModal;