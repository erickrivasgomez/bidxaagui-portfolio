// admin/src/components/layout/Layout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleMenuClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isOpen} onClose={handleClose} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={handleMenuClick} />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
          <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
