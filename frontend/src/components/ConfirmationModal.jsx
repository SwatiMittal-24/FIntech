import React from "react";
import { X, AlertCircle } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
              <AlertCircle size={22} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-300 text-[15px] leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 bg-[#1e293b66] border-t border-[#1E293B]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 bg-[#1E293B] border border-[#334155] hover:bg-[#334155] transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
