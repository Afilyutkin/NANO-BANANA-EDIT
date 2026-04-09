import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  onNavigate: (view: 'gallery' | 'editor') => void;
  currentView: 'gallery' | 'editor';
  onShowFavorites: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, onShowFavorites, onOpenSettings }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLangSelect = (lang: 'en' | 'ru') => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate('gallery')}
          aria-label="Banana Edit — go to gallery"
          className="flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500 rounded-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-banana-500 text-black font-bold select-none" aria-hidden="true">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Banana <span className="text-banana-400">Edit</span>
          </span>
        </button>

        <nav className="flex items-center gap-3 sm:gap-4" aria-label="Main navigation">

          {/* Language Switcher — click-based (works on touch) */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen((o) => !o)}
              aria-label={`Language: ${language === 'en' ? 'English' : 'Русский'}. Click to change`}
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500 rounded-md px-1 py-0.5"
            >
              {language}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangOpen && (
              <div
                role="listbox"
                aria-label="Select language"
                className="absolute right-0 mt-2 w-28 origin-top-right rounded-lg border border-white/10 bg-neutral-900 shadow-xl ring-1 ring-black/20"
              >
                <div className="py-1">
                  <button
                    type="button"
                    role="option"
                    aria-selected={language === 'en'}
                    onClick={() => handleLangSelect('en')}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      language === 'en'
                        ? 'text-banana-400 bg-white/5 font-medium'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    role="option"
                    aria-selected={language === 'ru'}
                    onClick={() => handleLangSelect('ru')}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      language === 'ru'
                        ? 'text-banana-400 bg-white/5 font-medium'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Русский
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorites Button */}
          <button
            type="button"
            onClick={onShowFavorites}
            aria-label={t.gallery?.tab_favorites || 'Favorites'}
            title={t.gallery?.tab_favorites || 'Favorites'}
            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
            className="p-1.5 text-gray-400 hover:text-banana-400 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" aria-hidden="true" />

          {/* Gallery Nav */}
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            aria-current={currentView === 'gallery' ? 'page' : undefined}
            className={`text-sm font-medium transition-colors hover:text-banana-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500 rounded-md px-1 py-0.5 ${
              currentView === 'gallery' ? 'text-banana-400' : 'text-gray-400'
            }`}
          >
            {t.nav.gallery}
          </button>

          {/* Create Button */}
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            aria-current={currentView === 'editor' ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-banana-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              currentView === 'editor'
                ? 'bg-banana-500 text-black hover:bg-banana-400'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {t.nav.create_new}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
