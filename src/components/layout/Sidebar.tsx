import React from 'react';
import { FiHome, FiFileText, FiShuffle, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import './Sidebar.css';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeAlerts } = useAppSelector((state) => state.alert);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="sidebar" style={{ width: 200, position: 'fixed', left: 0, top: 0, bottom: 0, padding: 16 }}>
      <div className="sidebar-logo">
        <h2>{!collapsed ? 'KYC RISK ENGINE' : 'KRE'}</h2>
      </div>

      <nav className="nav-list" style={{ marginTop: 16 }}>
        <button className="nav-item" onClick={() => navigate('/dashboard')}>
          <FiHome /> {!collapsed && <span>Dashboard</span>}
        </button>
        <button className="nav-item" onClick={() => navigate('/kyc')}>
          <FiFileText /> {!collapsed && <span>KYC Panel</span>}
        </button>
        <button className="nav-item" onClick={() => navigate('/simulator')}>
          <FiShuffle /> {!collapsed && <span>Transaction Simulator</span>}
        </button>
      </nav>

      <div className="sidebar-footer" style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#dc2626' }}>{activeAlerts}</div>
          <div>
            <span style={{ marginRight: 8 }}>{!collapsed && (user?.name || 'User')}</span>
            <button onClick={handleLogout} className="btn-link">
              <FiLogOut /> {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
