
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);

  useEffect(() => {
    // API key management is strictly handled by environment variables.
    // This component now only displays status information.
    if (isOpen) {
      const hasKey = !!process.env.API_KEY;
      setIsKeyConfigured(hasKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-6 text-left shadow-2xl transition-all animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-banana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {/* Fix: Property 'settings' now exists on translation object */}
            {t.settings.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {/* Fix: Property 'settings' now exists on translation object */}
          {t.settings.description}
        </p>

        <div className="mb-6">
          <label className="block text-xs font-medium text-banana-500 uppercase tracking-wider mb-2">
            {/* Fix: Property 'settings' now exists on translation object */}
            {t.settings.label}
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={isKeyConfigured ? "************************" : "NOT CONFIGURED"}
              placeholder={t.settings.placeholder}
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3 text-white placeholder-gray-600 focus:outline-none transition-all font-mono text-sm opacity-50 cursor-not-allowed"
            />
          </div>
          <div className="mt-2 flex justify-between items-center">
             <span className={`text-xs ${isKeyConfigured ? 'text-green-500' : 'text-red-500'}`}>
               {/* Fix: Property 'settings' now exists on translation object */}
               {isKeyConfigured ? t.settings.saved_status : t.settings.no_key_status}
             </span>
             <a 
               href="https://ai.google.dev/gemini-api/docs/billing" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-xs text-banana-500 hover:underline flex items-center gap-1"
             >
               {/* Fix: Property 'settings' now exists on translation object */}
               {t.settings.get_key_link}
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
               </svg>
             </a>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-banana-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-banana-400 transition-colors shadow-lg shadow-banana-500/10"
          >
            {/* Fix: Property 'settings' now exists on translation object */}
            {t.settings.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
