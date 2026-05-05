import React from "react";
import { useAuthStore } from "../store/authStore";
import UserLayout from "../components/Layout/UserLayout";
import { User as UserIcon, ShieldCheck, ShieldAlert, Activity, Key } from "lucide-react";

const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { 
      icon: user?.security_level === 'low' ? ShieldAlert : ShieldCheck, 
      label: "Security Level", 
      value: user?.security_level === 'low' ? "Low" : "Normal", 
      color: user?.security_level === 'low' ? "text-red-500" : "text-green-500", 
      bg: user?.security_level === 'low' ? "bg-red-50" : "bg-green-50" 
    },
    { icon: Activity, label: "Last Activity", value: "Login Successful", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Key, label: "Active Tokens", value: "1 Session", color: "text-brand-primary", bg: "bg-brand-primary/5" },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-brand-primary">Dashboard User</h1>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 flex items-center space-x-8">
            <div className="w-24 h-24 bg-brand-secondary/20 rounded-2xl flex items-center justify-center text-brand-primary">
              <UserIcon size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-brand-primary mb-1">Welcome, {user?.name}!</h2>
              <p className="text-gray-400 text-lg font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-6`}>
                <stat.icon size={24} />
              </div>
              <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default DashboardPage;
