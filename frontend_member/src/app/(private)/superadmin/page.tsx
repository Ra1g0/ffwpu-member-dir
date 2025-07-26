import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/header.tsx';
import Sidebar from '../../../components/sidebar.tsx';
import { FaSyncAlt, FaPlus, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import Modal from '../../../components/memberListModal.tsx';
import MemberEditModal from '../../../components/memberEditModal.tsx';
import MemberAddModal from '../../../components/memberAddModal.tsx';

function MemberPage() {
  const API_BASE = 'https://directorybackend-production.up.railway.app/directory';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('All Months');
  const [region, setRegion] = useState('All Region');
  const [nation, setNation] = useState('All Nations');
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const rowsPerPage = 50;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/members/`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Failed to load members. Please try again.');
    }
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (member) => {
    if (!member || !member.member_id) {
      alert('Invalid member data');
      return;
    }
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete || !memberToDelete.member_id) {
      alert('Invalid member data');
      return;
    }
    
    try {
      setIsDeleting(true);
      
      // Soft delete by setting is_deleted to true
      await axios.put(`${API_BASE}/members/${memberToDelete.member_id}/update/`, {
        is_deleted: true
      });

      // Update local state to reflect the deletion
      const updatedMembers = members.map(m => 
        m.member_id === memberToDelete.member_id ? { ...m, is_deleted: true } : m
      );
      
      setMembers(updatedMembers);
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
      
      alert('Member has been archived successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to archive member: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchMembers();
    setCurrentPage(1);
  };

  // Filtering logic - excludes soft deleted members
  const filteredMembers = members.filter((member) => {
    if (member.is_deleted) return false;

    const matchesSearch =
      member.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      member.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRegion =
      region === 'All Region' || member.region === region;

    const matchesNation =
      nation === 'All Nations' || member.nation === nation;

    let matchesMonth = true;
    if (month !== 'All Months' && member.birthday) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const memberMonth = monthNames[new Date(member.birthday).getMonth()];
      matchesMonth = memberMonth === month;
    }

    return matchesSearch && matchesRegion && matchesNation && matchesMonth;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMembers.slice(indexOfFirstRow, indexOfLastRow);
  const totalMembers = filteredMembers.length;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="mt-[100px] mb-[28rem] md:ml-[250px] ml-12 p-4 w-[1250px]">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_1px_black]">
            MEMBERS
          </h2>
          <button 
            onClick={() => window.location.reload()}
            className="w-fit flex items-center gap-3 bg-white text-black px-10 py-1 rounded-md text-sm hover:bg-[#053969] hover:text-white transition"
          >
            <FaSyncAlt className="text-base" />
            Refresh
          </button>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 min-w-[200px] border border-black rounded-md px-4 h-[32px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select 
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer"
          >
            <option>All Months</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>

          <select 
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer"
          >
            <option>All Region</option>
            <option>Luzon</option>
            <option>Visayas</option>
            <option>Mindanao</option>
          </select>

          <select 
            value={nation}
            onChange={(e) => {
              setNation(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer"
          >
            <option>All Nations</option>
            <option>Philippines</option>
            <option>Japan</option>
            <option>Korea</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="border border-black flex items-center gap-2 bg-white text-black px-7 py-1.5 h-[32px] rounded-md text-sm hover:bg-[#053969] hover:text-white transition"
          >
            <FaPlus className="text-sm" />
            Add Member
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full bg-white text-sm text-center border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-[#245AD2] text-white">
              <tr className="border-b bg-white text-black text-[1px]">
                <th colSpan="8" className="px-4 py-2">
                  <div className="flex justify-between text-xs text-gray-600 font-light">
                    <span>
                      Showing {totalMembers > 0 ? `${indexOfFirstRow + 1}–${Math.min(indexOfLastRow, totalMembers)} of ${totalMembers} members` : 'No members'}
                    </span>
                    <span>Page {currentPage} of {totalPages || 1}</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 rounded-l-lg">Name</th>
                <th className="px-4 py-2">Region</th>
                <th className="px-4 py-2">Nation</th>
                <th className="px-4 py-2">Organization</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((member) => (
                <tr key={member.member_id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{member.full_name || member.name}</td>
                  <td className="px-4 py-2">{member.region}</td>
                  <td className="px-4 py-2">{member.nation}</td>
                  <td className="px-4 py-2">{member.organization}</td>
                  <td className="px-4 py-2">{member.department}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleView(member)}
                        className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition hover:brightness-110 hover:shadow-md"
                        style={{ backgroundColor: '#066DC7' }}
                      >
                        <FaEye className="text-sm" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition hover:brightness-110 hover:shadow-md"
                        style={{ backgroundColor: '#064983' }}
                      >
                        <FaEdit className="text-sm" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(member)}
                        className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition hover:brightness-110 hover:shadow-md"
                        style={{ backgroundColor: '#dc2626' }}
                      >
                        <FaTrash className="text-sm" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Centered Pagination */}
        <div className="flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border border-gray-300 ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#245AD2] text-white hover:bg-[#1a4aaf]'}`}
            >
              <FaChevronLeft className="text-sm" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === pageNum ? 'bg-[#245AD2] text-white' : 'bg-[#245AD2] text-white hover:bg-[#1a4aaf]'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md border border-gray-300 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#245AD2] text-white hover:bg-[#1a4aaf]'}`}
            >
              <FaChevronRight className="text-sm" />
            </button>
          </nav>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={selectedMember}
        />
        
        <MemberEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          member={selectedMember}
          onSave={(updatedMember) => {
            const updatedMembers = members.map(m => 
              m.member_id === updatedMember.member_id ? updatedMember : m
            );
            setMembers(updatedMembers);
          }}
        />
        
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.4)] px-2 sm:px-4 flex justify-center items-start sm:items-center"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <div
              className="relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-4 sm:p-6 rounded-lg w-full max-w-7xl shadow-xl border border-gray-300 mt-[100px] sm:mt-0 ml-0 sm:ml-[250px] overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Archive Member</h3>
              <p className="mb-6">Are you sure you want to archive {memberToDelete?.full_name || memberToDelete?.name}? This will remove them from the active members list.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Archiving...
                    </>
                  ) : (
                    'Archive'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <MemberAddModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onMemberAdded={fetchMembers}
          />
        )}
      </div>
    </div>
  );
}

export default MemberPage;