import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../api';
import Toast, { type ToastType } from '../components/UI/Toast';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const navigate = useNavigate();

  const url = searchParams.get('url');

  useEffect(() => {
    const performVerification = async () => {
      if (!url) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await verifyEmail(decodeURIComponent(url));
        setStatus('success');
        setMessage(response.message);
        setToast({ message: response.message, type: 'success', isVisible: true });
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
        setToast({ 
          message: err.response?.data?.message || 'Verification failed.', 
          type: 'error', 
          isVisible: true 
        });
      }
    };

    performVerification();
  }, [url, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center"
      >
        <div className="flex justify-center mb-6">
          {status === 'loading' && <Loader2 className="text-brand-primary animate-spin" size={64} />}
          {status === 'success' && <ShieldCheck className="text-green-500" size={64} />}
          {status === 'error' && <XCircle className="text-red-500" size={64} />}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4 font-roboto">
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Failed'}
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          {message}
        </p>

        {status !== 'loading' && (
          <button
            onClick={() => navigate('/login')}
            className="mt-8 px-8 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-all"
          >
            Back to Login
          </button>
        )}
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

export default VerifyEmailPage;
