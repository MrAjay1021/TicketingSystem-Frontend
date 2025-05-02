import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContactCenterPage from './pages/ContactCenterPage';
import Analytics from './pages/Analytics';
import BotConfig from './pages/BotConfig';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './styles/global.css'; // Core styles
import './styles/noScrollbar.css'; // Hide scrollbars 
import './styles/layout.css'; // Grid and layout
import Toast from './components/Toast/Toast';

function App() {
  const [toast, setToast] = useState({ type: '', message: '' });

  // Toast notification handler
  useEffect(() => {
    const handleShowToast = (e) => {
      // Reset existing toast for animation
      setToast({ type: '', message: '' });
      
      // Small delay for animation
      setTimeout(() => {
        setToast(e.detail);
      }, 10);
    };
    
    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Auth-required routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tickets" 
              element={
                <ProtectedRoute>
                  <ContactCenterPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bot-config" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <BotConfig />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams" 
              element={
                <ProtectedRoute>
                  <TeamPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 