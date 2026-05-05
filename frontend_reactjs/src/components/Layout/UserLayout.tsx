import React from 'react';
import UserNavbar from './UserNavbar';
import UserSidebar from './UserSidebar';
import UserFooter from './UserFooter';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-brand-bg font-sans antialiased">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <UserNavbar />
        <main className="flex-1 p-8">
          {children}
        </main>
        <UserFooter />
      </div>
    </div>
  );
};

export default UserLayout;
