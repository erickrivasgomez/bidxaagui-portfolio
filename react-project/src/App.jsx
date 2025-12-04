import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Main App Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Comunidad from './pages/Comunidad';
import Consultorio from './pages/Consultorio';
import Antroponomadas from './pages/Antroponomadas';
import AntropologiaFisica from './pages/AntropologiaFisica';

// Admin Components
import AdminDashboard from './admin/pages/Dashboard';
import AdminLogin from './admin/pages/Login';
import AdminHeader from './admin/components/Header';
import AdminSidebar from './admin/components/Sidebar';

// Styles
import './App.css';
import './admin.css';

// Layout component for main app
const MainLayout = ({ children }) => (
  <>
    <Header />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </>
);

// Layout component for admin section
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';
  
  // Add authentication check here
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      {!isLoginPage && <AdminHeader />}
      <div className="admin-container">
        {!isLoginPage && <AdminSidebar />}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = ({ isAdmin = false }) => {
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Add more admin routes here */}
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      <Route path="/comunidad" element={
        <MainLayout>
          <Comunidad />
        </MainLayout>
      } />
      <Route path="/consultorio" element={
        <MainLayout>
          <Consultorio />
        </MainLayout>
      } />
      <Route path="/antroponomadas" element={
        <MainLayout>
          <Antroponomadas />
        </MainLayout>
      } />
      <Route path="/antropologia-fisica" element={
        <MainLayout>
          <AntropologiaFisica />
        </MainLayout>
      } />
      {/* Add a catch-all route for 404s */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
