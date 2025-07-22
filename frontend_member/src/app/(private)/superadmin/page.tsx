import React, { useState } from 'react';
import Header from '../../../components/header.tsx';
import Sidebar from '../../../components/sidebar.tsx';
import { FaSyncAlt, FaPlus, FaEye,FaEdit } from 'react-icons/fa';
import Modal from '../../../components/memberListModal.tsx'; 
import MemberEditModal from '../../../components/memberEditModal.tsx'; 
import MemberAddModal from '../../../components/memberAddModal.tsx';


function MemberPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleView = () => {
    const dummyMember = {
      name: 'John Regory',
      region: 'Luzon',
      nation: 'Philippines',
      organization: 'FFWPU',
      department: 'Youth',
      email: 'john@example.com',
    };
    setSelectedMember(dummyMember);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
  const dummyMember = {
    name: 'John Regory',
    region: 'Luzon',
    nation: 'Philippines',
    organization: 'FFWPU',
    department: 'Youth',
    email: 'john@example.com',
  };
  setSelectedMember(dummyMember);
  setIsEditModalOpen(true);
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
          <button className="w-fit flex items-center gap-3 bg-white text-black px-10 py-1 rounded-md text-sm hover:bg-[#053969] hover:text-white transition">
            <FaSyncAlt className="text-base" />
            Refresh
          </button>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 min-w-[200px] border border-black rounded-md px-4 h-[32px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer">
            <option>All Months</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>

          <select className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer">
            <option>All Region</option>
            <option>Luzon</option>
            <option>Visayas</option>
            <option>Mindanao</option>
          </select>

          <select className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer">
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
              {/* Info Row */}
              <tr className="border-b bg-white text-black text-[1px] ">
                <th colSpan="7" className="px-4 py-2">
                  <div className="flex justify-between text-xs text-gray-600 font-light">
                    <span>Showing 1–10 of 60 members</span>
                    <span>Page 1 of 6</span>
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
              <tr className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">John Regory</td>
                <td className="px-4 py-2">Luzon</td>
                <td className="px-4 py-2">Philippines</td>
                <td className="px-4 py-2">FFWPU</td>
                <td className="px-4 py-2">Youth</td>
                <td className="px-4 py-2">john@example.com</td>
                <td className="px-4 py-2">
                  <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleView}
                      className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition hover:brightness-110 hover:shadow-md"
                      style={{ backgroundColor: '#066DC7' }}
                    >
                      <FaEye className="text-sm" />
                      View
                    </button>

                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition hover:brightness-110 hover:shadow-md"
                      style={{ backgroundColor: '#064983' }}
                    >
                      <FaEdit className="text-sm" />
                      Edit
                    </button>
                  </div>
                </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={selectedMember}
        />
        <MemberEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          member={selectedMember}
        />
              {isAddModalOpen && (
        <MemberAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      </div>
    </div>
  );
}

export default MemberPage;
