
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load API key from localStorage
      const savedKey = localStorage.getItem('NANO_BANANA_API_KEY');
      if (savedKey) {
        setIsKeyConfigured(true);
      } else {
        setApiKey('');
        setIsKeyConfigured(false);
      }
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('NANO_BANANA_API_KEY', apiKey);
      setIsKeyConfigured(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleRemoveKey = () => {
    if (showConfirmDelete) {
      localStorage.removeItem('NANO_BANANA_API_KEY');
      setApiKey('');
      setIsKeyConfigured(false);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

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
            {t.settings.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {t.settings.description}
        </p>

        <div className="mb-6">
          <label className="block text-xs font-medium text-banana-500 uppercase tracking-wider mb-2">
            {t.settings.input_label}
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t.settings.placeholder}
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3 text-white placeholder-gray-600 focus:outline-none focus:border-banana-500 transition-all font-mono text-sm"
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className={`text-xs transition-all ${isKeyConfigured ? 'text-green-500' : 'text-yellow-500'}`}>
              {isKeyConfigured ? t.settings.saved_status : t.settings.no_key_status}
            </span>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-banana-500 hover:underline flex items-center gap-1"
            >
              {t.settings.get_key_link}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {showSuccess && (
            <div className="mt-3 text-xs text-green-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t.settings.save_success}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveKey}
            className="flex-1 rounded-lg bg-banana-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-banana-400 transition-colors shadow-lg shadow-banana-500/10"
          >
            {t.settings.save}
          </button>
          <button
            onClick={handleRemoveKey}
            className="flex-1 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            {showConfirmDelete ? t.settings.remove_confirm : t.settings.remove}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-neutral-700 transition-colors"
        >
          {t.settings.close}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
