import React, { useState, useEffect, useRef } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('NANO_BANANA_API_KEY');
      if (savedKey) {
        setIsKeyConfigured(true);
      } else {
        setApiKey('');
        setIsKeyConfigured(false);
      }
      setShowSuccess(false);
      setShowPassword(false);
      // Move focus to close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-6 text-left shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 id="settings-title" className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-banana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {t.settings.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 text-gray-400 hover:text-white transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {t.settings.description}
        </p>

        <div className="mb-6">
          <label htmlFor="api-key-input" className="block text-xs font-medium text-banana-500 uppercase tracking-wider mb-2">
            {t.settings.input_label}
          </label>

          {/* Password field with show/hide toggle */}
          <div className="relative">
            <input
              id="api-key-input"
              type={showPassword ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              placeholder={t.settings.placeholder}
              autoComplete="current-password"
              className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-banana-500 focus:ring-1 focus:ring-banana-500 transition-all font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide API key' : 'Show API key'}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500 rounded-r-xl"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <span
              className={`text-xs transition-colors ${isKeyConfigured ? 'text-green-500' : 'text-yellow-500'}`}
              aria-live="polite"
            >
              {isKeyConfigured ? t.settings.saved_status : t.settings.no_key_status}
            </span>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-banana-500 hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-banana-500 rounded"
            >
              {t.settings.get_key_link}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {showSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="mt-3 text-xs text-green-400 flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t.settings.save_success}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="flex-1 rounded-lg bg-banana-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-banana-400 transition-colors shadow-lg shadow-banana-500/10 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          >
            {t.settings.save}
          </button>
          <button
            type="button"
            onClick={handleRemoveKey}
            disabled={!isKeyConfigured}
            className="flex-1 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {showConfirmDelete ? t.settings.remove_confirm : t.settings.remove}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          {t.settings.close}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
