import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/(private)/login/page'
import DashboardPage from './app/(private)/dashboard/page'
import MemberPage from './app/(private)/member/page'
import ForgotPassword from './app/(private)/login/forgatpass/page'
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/member" element={<PrivateRoute><MemberPage /></PrivateRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes> 
  )
}

export default App
