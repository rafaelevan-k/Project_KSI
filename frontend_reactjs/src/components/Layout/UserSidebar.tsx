import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, History, Settings, LogOut, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ConfirmationModal from '../UI/ConfirmationModal';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Shield, label: 'Vulnerability Testing', path: '/vulnerability-testing' },
    { icon: History, label: 'Logs', path: '/logs' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 lg:px-0 lg:justify-center lg:group-hover:justify-start lg:group-hover:px-8 transition-all duration-300">
        <div className="flex items-center space-x-3 lg:space-x-0 lg:group-hover:space-x-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <Shield size={24} />
          </div>
          <span className="text-xl font-bold text-brand-primary tracking-tighter uppercase whitespace-nowrap block lg:hidden lg:group-hover:block opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
            KSI Project
          </span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-brand-primary transition-colors ml-auto"
        >
          <X size={24} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-6 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) => `
              flex items-center h-12 w-full lg:w-12 lg:group-hover:w-full rounded-2xl transition-all duration-300 group/item
              ${isActive 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-gray-500 hover:bg-brand-primary/5 hover:text-brand-primary'}
              px-4 lg:px-0 lg:group-hover:px-4
            `}
          >
            <div className="flex items-center justify-start lg:justify-center lg:group-hover:justify-start w-full transition-all duration-300">
              <item.icon size={20} className="transition-transform group-hover/item:scale-110 flex-shrink-0" />
              <span className="font-semibold text-sm ml-3 block lg:hidden lg:group-hover:block opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </div>
            <ChevronRight size={16} className="ml-auto block lg:hidden lg:group-hover:block opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </div>

      {/* Session/Logout Card */}
      <div className="p-4 mt-auto">
        <div className="bg-red-50/50 rounded-2xl relative overflow-hidden border border-red-100 transition-all duration-300 h-auto lg:h-12 lg:w-12 lg:group-hover:w-full lg:group-hover:h-auto p-5 lg:p-0 lg:group-hover:p-5 flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          <div className="flex items-center justify-start lg:justify-center lg:group-hover:justify-start transition-all lg:px-0 px-0">
            <LogOut className="text-red-500 flex-shrink-0" size={20} />
            <span className="text-sm font-semibold text-gray-800 ml-3 block lg:hidden lg:group-hover:block opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all whitespace-nowrap">
              Session
            </span>
          </div>

          <div className="block lg:hidden lg:group-hover:block opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 mt-4 lg:mt-0">
            <p className="text-xs text-gray-500 mb-4 font-medium">Click button below to end your current session.</p>
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full py-2.5 bg-white text-red-500 text-xs font-bold rounded-xl border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-20 hover:w-72 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out group z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-transform duration-300 transform lg:hidden
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out from your account?"
        confirmText="Sign Out"
        type="danger"
      />
    </>
  );
};

export default UserSidebar;
