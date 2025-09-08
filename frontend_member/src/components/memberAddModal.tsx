import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const API_BASE = 'https://ffwpu-member-dir.up.railway.app/directory';
const CLOUDINARY_UPLOAD_PRESET = 'members_uploads'; 
const CLOUDINARY_CLOUD_NAME = 'debx9uf7g';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const MemberAddModal = ({ isOpen, onClose, onMemberAdded }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    region: '',
    nation: '',
    nationality: '',
    birthday: '',
    gender: '',
    department: '',
    organization: '',
    currentPost: '',
    position: '',
    blessing: '',
    dateOfJoining: '',
    phone: '',
    address: '',
    profile_photo_url: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

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
    if (!path) return "https://ui-avatars.com/api/?name=New+Member";
    if (path.startsWith('http')) return path;
    return `${CLOUDINARY_BASE_URL}/${path.replace('image/upload/', '')}`;
  };

  const formatDateForSubmission = (dateString) => {
    if (!dateString) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return null;
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imagePath = extractImagePath(response.data.secure_url);
      setFormData(prev => ({ ...prev, profile_photo_url: imagePath }));
      return imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    await handleImageUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateMember = async () => {
    setError('');
    setIsLoading(true);
    
    if (!formData.full_name || !formData.email || !formData.region || !formData.nation) {
      setError('Please fill in all required fields (Name, Email, Region, Nation)');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        region: formData.region,
        nation: formData.nation,
        nationality: formData.nationality || null,
        birthday: formatDateForSubmission(formData.birthday),
        gender: formData.gender || null,
        department: formData.department || null,
        organization: formData.organization || null,
        current_post: formData.currentPost || null,
        position: formData.position || null,
        blessing: formData.blessing || null,
        date_of_joining: formatDateForSubmission(formData.dateOfJoining),
        phone_no: formData.phone || null,
        address: formData.address || null,
        profile_photo_url: formData.profile_photo_url || null
      };

      const res = await axios.post(`${API_BASE}/members/create/`, payload, {
        validateStatus: (status) => status < 500
      });

      if (res.status === 400) {
        throw new Error(res.data.message || 'Validation failed');
      }

      alert('Member created successfully!');
      onMemberAdded(res.data);
      onClose();
    } catch (error) {
      let errorMessage = 'Failed to create member';
      if (error.response) {
        errorMessage += `\nStatus: ${error.response.status}`;
        if (error.response.data) {
          errorMessage += `\nMessage: ${error.response.data.message || JSON.stringify(error.response.data)}`;
          if (error.response.data.errors) {
            errorMessage += `\nValidation Issues:\n${JSON.stringify(error.response.data.errors, null, 2)}`;
          }
        }
      } else {
        errorMessage += `\n${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] px-2 sm:px-4 flex justify-center items-start sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-lg w-full max-w-4xl shadow-xl border border-gray-300 mt-[100px] sm:mt-0 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        <h2 className="border-b border-gray-300 text-lg sm:text-xl font-bold mb-4">Add Member Profile</h2>

        <div className="text-sm text-gray-800 space-y-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 whitespace-pre-wrap">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 px-4 sm:px-8">
            <div className="flex flex-col w-full sm:w-1/3 h-full">
              <div className="flex flex-col items-center sm:items-center text-center sm:text-left mt-4">
                <div className="relative group">
                  <img
                    src={previewImage || getFullImageUrl(formData.profile_photo_url)}
                    alt="Profile"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow mx-auto sm:mx-0 border-4 border-white"
                  />
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
                </div>
                {isUploading && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Uploading image...
                  </div>
                )}
                {formData.profile_photo_url && !isUploading && (
                  <p className="mt-2 text-xs text-green-600">Image uploaded successfully</p>
                )}
              </div>
            </div>
            <div className="flex-1 text-sm text-gray-800 space-y-2">
              <h2 className="text-lg sm:text-xl font-bold mb-2">Personal and Contact Details</h2>
              <div className="space-y-2">
                {[
                  { label: 'Full Name*', key: 'full_name', required: true },
                  { label: 'Email*', key: 'email', required: true, type: 'email' },
                  { label: 'Region*', key: 'region', required: true },
                  { label: 'Nation*', key: 'nation', required: true },
                  { label: 'Nationality', key: 'nationality' },
                  { label: 'Birthday', key: 'birthday', type: 'date' },
                  { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                  { label: 'Department', key: 'department' },
                  { label: 'Organization', key: 'organization' },
                  { label: 'Current Post', key: 'currentPost' },
                  { label: 'Position Title', key: 'position' },
                  { label: 'Blessing', key: 'blessing' },
                  { label: 'Date of Joining', key: 'dateOfJoining', type: 'date' },
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                  { label: 'Address', key: 'address' },
                ].map(({ label, key, type, options, required }) => (
                  <div key={key} className="flex items-center gap-2">
                    <label className={`w-40 font-semibold ${required ? 'text-red-500' : ''}`}>
                      {label}
                    </label>
                    {type === 'select' ? (
                      <select
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={formData[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        required={required}
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
                        required={required}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCreateMember}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md flex items-center justify-center min-w-32"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Creating...
                      </>
                    ) : (
                      <>
                        <FaPlus className="mr-1" /> Create Member
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAddModal;