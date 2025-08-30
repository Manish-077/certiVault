// src/components/Login.js
import React, { useState } from 'react';
import { login, register } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onLogin(); // Notify App component
      navigate('/profile');
    } catch (err) {
      let msg = 'An unexpected error occurred. Please try again.';
      try { const parsed = JSON.parse(err.message); msg = parsed.error || msg; } catch {}
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container card fade-in-up">
      <h1 className="text-center text-3xl font-bold mb-4">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
      <p className="text-center text-sm text-gray-600 mb-8">{isLogin ? 'Sign in to access your portfolio' : 'Get started in seconds'}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 font-semibold ml-1 hover:text-blue-600"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
