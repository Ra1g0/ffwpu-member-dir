import Header from '../../../components/header.tsx';
import Sidebar from '../../../components/sidebar.tsx';



import { FaSyncAlt, FaPlus } from 'react-icons/fa';

function MemberPage() {
  return (
    <div>
      <Header />
      <Sidebar />

      <div className="mt-[100px] mb-[28rem] md:ml-[250px] ml-12 p-4 w-[1250px]">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
    <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_1px_black]">
      MEMBERS
    </h2>
    <button className="flex items-center gap-11 bg-white text-black px-6 py-1.5 rounded-md text-sm hover:bg-[#053969] hover:text-white transition">
      <FaSyncAlt className="text-base" />
      Refresh
    </button>
  </div>

        {/* Filter + Search */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search "
            className="flex-1 min-w-[200px] border border-black-500 rounded-md px-4 h-[38px] text-sm color-white bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select className="border border-black-500 rounded-md px-6 h-[38px] text-sm cursor-pointer bg-white">
            <option>All Months</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
          </select>

          <select className="border border-black-500 rounded-md px-6 h-[38px] text-sm cursor-pointer bg-white">
            <option>All Region</option>
            <option>Luzon</option>
            <option>Visayas</option>
            <option>Mindanao</option>
          </select>

          <select className="border border-black-500 rounded-md px-6 h-[38px] text-sm cursor-pointer bg-white">
            <option>All Nations</option>
            <option>Philippines</option>
            <option>Japan</option>
            <option>Korea</option>
          </select>

          <button className="border border-black-500 flex items-center gap-2 bg-white text-black px-6 py-1.5 rounded-md text-sm hover:bg-[#053969] hover:text-white transition">
            <FaPlus className="text-sm" />
            Add Members
          </button>
        </div>

        {/* Main content */}
        <div className="mt-6 text-black">
          {/* Table Section */}
<div className="overflow-x-auto mt-6">
  <table className="min-w-full bg-white text-sm text-left border border-gray-200 rounded-md overflow-hidden">
    <thead className="bg-[#245AD2] text-white">
      <tr>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Region</th>
        <th className="px-4 py-2">Nation</th>
        <th className="px-4 py-2">Organization</th>
        <th className="px-4 py-2">Department</th>
        <th className="px-4 py-2">Email</th>
        <th className="px-4 py-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {/* Example row – repeat as needed */}
      <tr className="border-t hover:bg-gray-100">
        <td className="px-4 py-2">John Regory</td>
        <td className="px-4 py-2">Luzon</td>
        <td className="px-4 py-2">Philippines</td>
        <td className="px-4 py-2">FFWPU</td>
        <td className="px-4 py-2">Youth</td>
        <td className="px-4 py-2">john@example.com</td>
        <td className="px-4 py-2">
          <button className="text-blue-600 hover:underline">View</button>&nbsp;&nbsp;
          <button className="text-blue-600 hover:underline">Edit</button>
        </td>
      </tr>
      {/* Add more rows here */}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
}

export default MemberPage;

