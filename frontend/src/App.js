import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { logout } from './utils/api';
import Login from './components/Login';
import Profile from './pages/Profile';
import UploadPage from './pages/Upload.js';
import About from './components/About';
import UserProfile from './components/UserProfile';
import PublicProfile from './pages/PublicProfile';
import './App.css';
import { FaSun, FaMoon } from 'react-icons/fa';

// Function to check if a token exists in local storage
const isAuthenticated = () => !!localStorage.getItem('token');

function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthed, setIsAuthed] = useState(isAuthenticated());
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    setIsAuthed(false);
    navigate('/login');
  };

  const handleLogin = () => {
    setIsAuthed(true);
  };

  return (
    <>
      <header className="main-header">
        <div className="container nav-content">
          <Link to="/" className="nav-logo">CertifyMe</Link>
          <div className="nav-links">
            <Link to="/about">About</Link>
            {isAuthed ? (
              <>
                <Link to="/profile">My Portfolio</Link>
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
            <button onClick={toggleTheme} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={isAuthed ? <Navigate to="/profile" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/login" element={isAuthed ? <Navigate to="/profile" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/portfolio/:userId" element={<PublicProfile />} />
          <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
