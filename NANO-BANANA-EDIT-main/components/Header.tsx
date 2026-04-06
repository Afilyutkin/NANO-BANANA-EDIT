import React from 'react';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  onNavigate: (view: 'gallery' | 'editor') => void;
  currentView: 'gallery' | 'editor';
  onShowFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, onShowFavorites }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('gallery')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-banana-500 text-black font-bold">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Banana <span className="text-banana-400">Edit</span>
          </span>
        </div>
        
        <nav className="flex items-center gap-4 sm:gap-6">
            {/* Language Switcher */}
            <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white uppercase">
              {language}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-lg border border-white/10 bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`block w-full px-4 py-2 text-left text-sm ${language === 'en' ? 'text-banana-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`block w-full px-4 py-2 text-left text-sm ${language === 'ru' ? 'text-banana-400 bg-white/5' : 'text-gray-300 hover:bg-white/5'}`}
                >
                  Русский
                </button>
              </div>
            </div>
          </div>

            {/* Favorites Button */}
            <button 
              onClick={onShowFavorites}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title={t.gallery?.tab_favorites || "Favorites"}
            >
              <svg className="w-5 h-5 fill-none stroke-current hover:fill-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block"></div>

          <button
            onClick={() => onNavigate('gallery')}
            className={`text-sm font-medium transition-colors hover:text-banana-400 ${
              currentView === 'gallery' ? 'text-banana-400' : 'text-gray-400'
            }`}
          >
            {t.nav.gallery}
          </button>
          <button
            onClick={() => onNavigate('editor')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
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