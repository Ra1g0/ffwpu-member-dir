import React, { useState } from 'react';
import Header from '../../../components/header.tsx';
import Sidebar from '../../../components/sidebar.tsx';
import { FaSyncAlt, FaPlus, FaEye,FaEdit } from 'react-icons/fa';
import Modal from '../../../components/memberListModal.tsx'; 
import MemberEditModal from '../../../components/memberEditModal.tsx'; 
import MemberAddModal from '../../../components/memberAddModal.tsx';


function MemberPage() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  );
}

export default MemberPage;
