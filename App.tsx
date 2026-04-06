import React, { useState } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Editor from './components/Editor';
import { PromptExample, ViewMode } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'gallery' | 'editor'>('gallery');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptExample | null>(null);
  const [galleryViewMode, setGalleryViewMode] = useState<ViewMode>('all');
  const { t } = useLanguage();

  const handleNavigate = (view: 'gallery' | 'editor') => {
    setCurrentView(view);
    if (view === 'gallery') {
      setSelectedPrompt(null);
      // Reset filter when navigating via main menu to avoid confusion
      setGalleryViewMode('all');
    }
  };
  
  const handleShowFavorites = () => {
    setCurrentView('gallery');
    setGalleryViewMode('favorites');
    setSelectedPrompt(null);
  };

  const handleSelectPrompt = (prompt: PromptExample) => {
    setSelectedPrompt(prompt);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-banana-500/30">
      <Header 
        onNavigate={handleNavigate} 
        currentView={currentView} 
        onShowFavorites={handleShowFavorites}
      />
      
      <main className="transition-opacity duration-300">
        {currentView === 'gallery' ? (
          <Gallery 
            onSelectPrompt={handleSelectPrompt} 
            viewMode={galleryViewMode}
            onViewModeChange={setGalleryViewMode}
          />
        ) : (
          <Editor initialPrompt={selectedPrompt} />
        )}
      </main>

      <footer className="border-t border-white/5 bg-black py-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
        <p>{t.footer.powered_by}</p>
        
        <a 
          href="https://t.me/afilyutkin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-400 hover:bg-[#24A1DE]/10 hover:text-[#24A1DE] transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span>{t.footer.creator}: @afilyutkin</span>
        </a>

        <p className="mt-1 text-xs opacity-50">Banana Edit &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;