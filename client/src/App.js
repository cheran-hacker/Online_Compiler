import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Compiler from './pages/Compiler';
import WebEditor from './pages/WebEditor';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <div className={`app-root ${theme}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/editor" element={<Compiler />} />
        <Route path="/web-editor" element={<WebEditor />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
