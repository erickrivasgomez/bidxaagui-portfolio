import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const AdminHeader = () => {
  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout');
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/admin/dashboard">BIDXAAGUI Admin</Link>
        </div>
        <nav className="admin-nav">
          <ul>
            <li><Link to="/" target="_blank" rel="noopener noreferrer">View Site</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
