import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/(private)/login/page'
import DashboardPage from './app/(private)/dashboard/page'
import MemberPage from './app/(private)/member/page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/member" element={<MemberPage />} />
    </Routes>
  )
}

export default App
