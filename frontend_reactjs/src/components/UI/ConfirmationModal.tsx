import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, LogOut } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "primary";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "primary" }) => {
  // Use createPortal to ensure the modal is rendered at the top level of the DOM
  // This avoids stacking context issues with sticky/fixed parents
  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop with enhanced blur */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="relative w-full max-w-md bg-[#F9F8F6] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden z-10 border border-[#EFE9E3]"
          >
            <div className="p-6 md:p-10">
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div className={`p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] ${type === "danger" ? "bg-red-50 text-red-500" : "bg-[#C9B59C]/10 text-[#C9B59C]"}`}>
                  {type === "danger" ? <LogOut className="w-7 h-7 md:w-9 md:h-9" /> : <AlertCircle className="w-7 h-7 md:w-9 md:h-9" />}
                </div>
                <button onClick={onClose} className="p-2 md:p-3 text-[#C9B59C]/40 hover:text-[#C9B59C] hover:bg-[#C9B59C]/5 rounded-2xl transition-all">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#333] mb-3 tracking-tight leading-tight text-center">{title}</h3>
              <p className="text-[#333]/60 font-medium leading-relaxed mb-8 md:mb-10 text-base md:text-lg text-center">{message}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onClose} className="flex-1 px-8 py-4.5 bg-[#D9CFC7]/20 text-[#C9B59C] rounded-[1.25rem] font-bold hover:bg-[#D9CFC7]/30 transition-all active:scale-95">
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-8 py-4.5 text-white rounded-[1.25rem] font-bold transition-all shadow-xl active:scale-95 ${
                    type === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-[#C9B59C] hover:bg-[#C9B59C]/90 shadow-[#C9B59C]/30"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>

            {/* Subtle brand decoration at the bottom */}
            <div className="h-2 bg-gradient-to-r from-transparent via-[#C9B59C]/30 to-transparent w-full opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
