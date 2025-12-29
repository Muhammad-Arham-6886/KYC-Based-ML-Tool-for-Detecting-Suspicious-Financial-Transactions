import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { login } from '../../store/slices/authSlice';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes('@') || password.length < 6) {
      window.alert('Please enter valid credentials');
      return;
    }
    try {
      setLoading(true);
      dispatch(login({ id: '1', email, name: email.split('@')[0] }));
      localStorage.setItem('token', 'mock-token');
      window.alert('Login successful');
      navigate('/dashboard');
    } catch (err) {
      window.alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>KYC Risk Evaluation Tool</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </label>
          <label>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.currentTarget.checked)} /> Remember me
          </label>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};
