import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/header.tsx';
import Sidebar1 from '../../../components/sidebar1.tsx';
import { FaEye } from 'react-icons/fa';
import Modal from '../../../components/memberListModal.tsx';

// Define the Member type
interface Member {
  id?: string;
  full_name?: string;
  email?: string;
  region?: string;
  nation?: string;
  organization?: string;
  department?: string;
  birthday?: string; 
}

function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('All Months');
  const [region, setRegion] = useState('All Region');
  const [nation, setNation] = useState('All Nations');

  useEffect(() => {
    axios
      .get('https://ffwpu-member-dir.up.railway.app/directory/members/')
      .then((res) => setMembers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // Filtering logic
  const filteredMembers = members.filter((member) => {
    // Search by name or email
    const matchesSearch =
      member.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      member.email?.toLowerCase().includes(search.toLowerCase());

    // Filter by region
    const matchesRegion =
      region === 'All Region' || member.region === region;

    // Filter by nation
    const matchesNation =
      nation === 'All Nations' || member.nation === nation;

    // Filter by month (checks birthday month)
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

  return (
    <div>
      <Header />
      

      <div className="mt-[100px] mb-[28rem] md:ml-[250px] ml-12 p-4 w-[1250px]">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_1px_black]">
            MEMBERS
          </h2>
          <button
            className="w-fit flex items-center gap-3 bg-white text-black px-10 py-1 rounded-md text-sm hover:bg-[#053969] hover:text-white transition"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 min-w-[200px] border border-black rounded-md px-4 h-[32px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
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
            className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option>All Region</option>
            <option>Luzon</option>
            <option>Visayas</option>
            <option>Mindanao</option>
          </select>

          <select
            className="border border-black rounded-md px-6 h-[32px] text-sm bg-white cursor-pointer"
            value={nation}
            onChange={(e) => setNation(e.target.value)}
          >
            <option>All Nations</option>
            <option>Philippines</option>
            <option>Japan</option>
            <option>Korea</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full bg-white text-sm text-center border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-[#245AD2] text-white">
              {/* Info Row */}
              <tr className="border-b bg-white text-black text-[1px] ">
                <th colSpan={7} className="px-4 py-2">
                  <div className="flex justify-between text-xs text-gray-600 font-light">
                    <span>
                      Showing{' '}
                      {filteredMembers.length > 0
                        ? `1–${Math.min(10, filteredMembers.length)} of ${
                            filteredMembers.length
                          } members`
                        : 'No members'}{' '}
                    </span>
                    <span>
                      Page 1 of {Math.ceil(filteredMembers.length / 10) || 1}
                    </span>
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
              {filteredMembers.slice(0, 10).map((member) => (
                <tr
                  key={member.id || member.email}
                  className="border-t hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{member.full_name}</td>
                  <td className="px-4 py-2">{member.region}</td>
                  <td className="px-4 py-2">{member.nation}</td>
                  <td className="px-4 py-2">{member.organization}</td>
                  <td className="px-4 py-2">{member.department}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleView(member)}
                        className="flex items-center gap-2 px-3 py-1 rounded-md text-white transition hover:brightness-110 hover:shadow-md"
                        style={{ backgroundColor: '#066DC7' }}
                      >
                        <FaEye className="text-sm" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={selectedMember}
        />
      </div>
    </div>
  );
}

export default UserPage;