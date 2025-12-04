import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <Link to="/admin/posts" className="dashboard-card">
          <h3>Posts</h3>
          <p>Manage blog posts and articles</p>
        </Link>
        <Link to="/admin/users" className="dashboard-card">
          <h3>Users</h3>
          <p>Manage user accounts</p>
        </Link>
        <Link to="/admin/settings" className="dashboard-card">
          <h3>Settings</h3>
          <p>Configure site settings</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
