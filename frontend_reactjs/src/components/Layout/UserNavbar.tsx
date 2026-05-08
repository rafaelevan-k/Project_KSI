import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { LogOut, User as UserIcon, Bell, Search, Shield, ShieldAlert, Loader2, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../UI/ConfirmationModal";
import { setSecurityLevel } from "../../api";
import toast from "react-hot-toast";

interface UserNavbarProps {
  onMenuClick: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const updateSecurityLevel = useAuthStore((state) => state.updateSecurityLevel);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSecurityToggle = async () => {
    if (!user) return;
    const nextLevel = user.security_level === "low" ? "normal" : "low";

    setIsUpdatingSecurity(true);
    try {
      await setSecurityLevel(nextLevel);
      updateSecurityLevel(nextLevel);
      toast.success(`Security level changed to ${nextLevel.toUpperCase()}`, {
        icon: nextLevel === "low" ? "🔓" : "🛡️",
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Failed to update security level");
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  return (
    <>
      <nav className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
          >
            <Menu size={20} className="md:w-6 md:h-6" />
          </button>
          
          {/* Logo for mobile only */}
          <div className="flex lg:hidden items-center space-x-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <Shield size={16} />
            </div>
            <span className="font-bold text-brand-primary uppercase text-xs tracking-tighter sm:text-sm">KSI</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Security Level Toggle */}
          <button
            onClick={handleSecurityToggle}
            disabled={isUpdatingSecurity}
            className={`flex items-center space-x-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl border transition-all duration-300 ${
              user?.security_level === "low" ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-100" : "bg-green-50 border-green-100 text-green-600 hover:bg-green-100"
            }`}
          >
            {isUpdatingSecurity ? <Loader2 className="animate-spin" size={14} /> : user?.security_level === "low" ? <ShieldAlert size={14} /> : <Shield size={14} />}
            <span className="text-[9px] md:text-sm font-bold uppercase tracking-wider">
              <span className="hidden sm:inline">Security: </span>{user?.security_level}
            </span>
          </button>

          <button className="relative p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="hidden md:block h-10 w-[1px] bg-gray-100"></div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-brand-primary leading-none mb-1">{user?.name}</p>
              <p className="text-xs font-medium text-gray-400 tracking-tighter">Authorized User</p>
            </div>
            <div className="group relative">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-brand-secondary/20 rounded-xl flex items-center justify-center text-brand-primary cursor-pointer hover:bg-brand-primary hover:text-white transition-all duration-300">
                <UserIcon size={20} />
              </div>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout} title="Sign Out" message="Are you sure you want to sign out from your account?" confirmText="Sign Out" type="danger" />
    </>
  );
};

export default UserNavbar;
