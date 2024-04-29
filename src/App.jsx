import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResponiveAppBar from './components/AppBar';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import MembersPage from './pages/MembersPage';
import MyNetworkPage from './pages/MyNetworkPage';
import ReportPage from './pages/ReportPage';
import useAuth from './hooks/useAuth'; // Import the useAuth hook

function App() {
  const { isLoggedIn, user, login, logout } = useAuth(); // Use the useAuth hook

  return (
    <Router>
      <ResponiveAppBar isLoggedIn={isLoggedIn} onLogout={logout} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage onLogin={login} isLoggedIn={isLoggedIn} />} />
        <Route path="/register" element={<RegistrationPage isLoggedIn={isLoggedIn} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/members" element={<MembersPage user={user} />} />
        <Route path="/network" element={<MyNetworkPage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
