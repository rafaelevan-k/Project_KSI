import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { login, register } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Toast, { type ToastType } from "../components/UI/Toast";

const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await login({ email: formData.email, password: formData.password });
        setUser(data.user);
        setToken(data.access_token);
        setToast({ message: 'Login successful!', type: 'success', isVisible: true });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        data = await register(formData);
        setToast({ message: data.message, type: 'success', isVisible: true });
        setIsLogin(true);
      }
    } catch (err: any) {
      setToast({ 
        message: err.response?.data?.message || "An error occurred. Please try again.", 
        type: 'error', 
        isVisible: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 relative overflow-hidden font-inter">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-brand-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tl from-brand-secondary/20 to-transparent rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 m-2 md:m-0">
        <div className="w-full md:w-1/2 bg-white bg-cover bg-center relative min-h-[200px] md:min-h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 to-brand-secondary/80 flex flex-col justify-center p-6 md:p-12 text-gray-700">
            <motion.h2 key={isLogin ? "login-title" : "signup-title"} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-4xl font-semibold mb-2 md:mb-6 font-roboto">
              {isLogin ? "Welcome Back!" : "Join Our Community"}
            </motion.h2>
            <p className="text-gray-700 text-sm md:text-lg mb-4 md:mb-8 font-medium">{isLogin ? "To keep connected with us please login with your personal info." : "Enter your personal details and start your journey with us."}</p>
            <button onClick={() => setIsLogin(!isLogin)} className="w-fit px-6 py-2 md:px-8 md:py-3 border-2 border-white rounded-full font-medium hover:bg-white hover:text-brand-primary transition-all duration-300 text-xs md:text-base">
              {isLogin ? "SIGN UP" : "SIGN IN"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-12 bg-white">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 font-roboto">{isLogin ? "Sign In" : "Create Account"}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-600">Password (8 karakter)</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {isLogin && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs text-brand-primary font-semibold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      name="password_confirmation"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-brand-primary font-semibold hover:underline">
              {isLogin ? "Create one now" : "Sign in here"}
            </button>
          </p>
        </div>
      </motion.div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
};

export default LoginPage;
