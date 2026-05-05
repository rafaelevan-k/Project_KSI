import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, History, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ConfirmationModal from '../UI/ConfirmationModal';

const UserSidebar: React.FC = () => {
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

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="h-20 flex items-center px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <Shield size={24} />
          </div>
          <span className="text-xl font-bold text-brand-primary tracking-tighter uppercase">KSI Project</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-gray-500 hover:bg-brand-primary/5 hover:text-brand-primary'}
            `}
          >
            <div className="flex items-center space-x-3">
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-semibold text-sm">{item.label}</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </div>

      <div className="p-4">
        <div className="bg-red-50/50 rounded-2xl p-5 relative overflow-hidden border border-red-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <LogOut className="text-red-500 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800 mb-1">Session</p>
          <p className="text-xs text-gray-500 mb-4 font-medium">Click button below to end your current session.</p>
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full py-2.5 bg-white text-red-500 text-xs font-bold rounded-xl border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out from your account?"
        confirmText="Sign Out"
        type="danger"
      />
    </aside>
  );
};

export default UserSidebar;
