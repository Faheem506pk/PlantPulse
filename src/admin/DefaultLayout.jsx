import React from 'react';
import AppSidebar from './AppSidebar';
import AppContent from './AppContent';
import "../assets/css/admin.css"; // Adjust the path as needed

const DefaultLayout = () => {
  return (
    <div className="main-layout-admin">
      <AppSidebar />
      <div className="main-content-admin">
        <AppContent />
      </div>
    </div>
  );
}

export default DefaultLayout;
