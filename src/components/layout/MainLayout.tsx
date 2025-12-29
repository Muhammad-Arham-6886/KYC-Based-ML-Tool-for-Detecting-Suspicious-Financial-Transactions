import React from 'react';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ marginLeft: 200, minHeight: '100vh' }} className="main-content">
            {children}
          </div>
        </div>
    );
};
