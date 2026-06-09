import React, { useState } from "react";
import UserLayout from "../components/Layout/UserLayout";
import { Settings, Lock, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { changePassword } from "../api";
import toast from "react-hot-toast";

const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await changePassword(formData);
      setSuccess(true);
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      toast.success("Password updated successfully!");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError[0]);
      } else {
        setError(err.response?.data?.message || "Failed to change password.");
      }
      toast.error("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary flex items-center space-x-3">
            <Settings className="w-8 h-8 text-brand-primary" />
            <span>Account Settings</span>
          </h1>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Lock className="text-brand-primary" size={24} />
              <span>Change Password</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-3 text-sm font-semibold border border-red-100">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex items-center space-x-3 text-sm font-semibold border border-green-100">
              <CheckCircle2 size={20} />
              <span>Password has been updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={formData.current_password}
                  onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.new_password_confirmation}
                    onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-70 flex items-center space-x-2"
              >
                <span>{loading ? "Saving..." : "Save Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default SettingsPage;
