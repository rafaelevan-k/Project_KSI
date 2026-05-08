import React, { useState } from 'react';
import UserNavbar from './UserNavbar';
import UserSidebar from './UserSidebar';
import UserFooter from './UserFooter';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-brand-bg font-sans antialiased">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <UserSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <UserNavbar onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
        <UserFooter />
      </div>
    </div>
  );
};

export default UserLayout;
