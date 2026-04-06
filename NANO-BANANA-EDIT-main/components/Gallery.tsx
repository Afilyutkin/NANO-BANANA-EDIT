
import React, { useState, useMemo } from 'react';
import { PROMPT_EXAMPLES } from '../data';
import { PromptExample, ViewMode } from '../types';
import { useLanguage } from '../LanguageContext';

interface GalleryProps {
  onSelectPrompt: (prompt: PromptExample) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onSelectPrompt, viewMode, onViewModeChange }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('banana_edit_favorites');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }
    return [];
  });
  
  const { t, language } = useLanguage();

  const toggleFavorite = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(title)
        ? favorites.filter(t => t !== title)
        : [...favorites, title];
    
    setFavorites(newFavorites);
    localStorage.setItem('banana_edit_favorites', JSON.stringify(newFavorites));
  };

  const handleCopy = (e: React.MouseEvent, prompt: string, title: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt).then(() => {
      setCopyStatus(title);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };
  
  // Extract categories dynamically based on the current view mode
  const categories = useMemo(() => {
    let promptsInMode = PROMPT_EXAMPLES;
    
    if (viewMode === 'favorites') {
        promptsInMode = PROMPT_EXAMPLES.filter(p => favorites.includes(p.title));
    } else if (viewMode !== 'all') {
        promptsInMode = PROMPT_EXAMPLES.filter(p => p.mode === viewMode);
    }
      
    const uniqueCategories = Array.from(new Set(promptsInMode.map(p => p.category)));
    return ['All', ...uniqueCategories.sort()];
  }, [viewMode, favorites]);

  // Filter prompts based on Mode, Category, and Search Query
  const filteredPrompts = PROMPT_EXAMPLES.filter(p => {
    // Mode filtering
    if (viewMode === 'favorites') {
        if (!favorites.includes(p.title)) return false;
    } else if (viewMode !== 'all') {
        if (p.mode !== viewMode) return false;
    }

    // Category filtering
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    
    // Search filtering
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) || 
        p.prompt.toLowerCase().includes(query) || 
        p.author.toLowerCase().includes(query);

    return matchesSearch;
  });

  // Reset category when mode changes if the current category doesn't exist in the new mode
  const handleModeChange = (mode: ViewMode) => {
    onViewModeChange(mode);
    setCategoryFilter('All');
  };

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-white">{t.gallery.title}</h2>
          
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-neutral-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-neutral-800 focus:border-banana-500/50 focus:ring-1 focus:ring-banana-500/50 transition-all sm:text-sm"
              placeholder={t.gallery.search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 space-x-1 bg-neutral-900 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            <button
              onClick={() => handleModeChange('all')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                viewMode === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.gallery.tab_all}
            </button>
            <button
              onClick={() => handleModeChange('generate')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                viewMode === 'generate'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.gallery.tab_generation}
            </button>
            <button
              onClick={() => handleModeChange('edit')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                viewMode === 'edit'
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.gallery.tab_editing}
            </button>
            <button
              onClick={() => handleModeChange('favorites')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                viewMode === 'favorites'
                  ? 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-400 border border-red-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
               <svg className={`w-4 h-4 ${viewMode === 'favorites' ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
              {t.gallery.tab_favorites}
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors border ${
                  categoryFilter === cat
                    ? 'bg-banana-500 border-banana-500 text-black'
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat === 'All' ? t.gallery.tab_all : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((item, index) => {
              const isFavorite = favorites.includes(item.title);
              const isCopied = copyStatus === item.title;
              return (
              <div
                key={`${item.title}-${index}`}
                className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-white/5 transition-all hover:border-banana-500/50 hover:shadow-2xl hover:shadow-banana-500/10"
                onClick={() => onSelectPrompt(item)}
              >
                {/* Image Container */}
                <div className="relative aspect-auto w-full overflow-hidden">
                  <img
                    src={item.preview}
                    alt={item.title}
                    loading="lazy"
                    className="w-full transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  
                  {/* Mode Badge (Top Left) */}
                  <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset backdrop-blur-md ${
                        item.mode === 'edit' 
                          ? 'bg-blue-500/30 text-blue-100 ring-blue-500/50' 
                          : 'bg-emerald-500/30 text-emerald-100 ring-emerald-500/50'
                      }`}>
                          {item.mode === 'edit' ? 'EDIT' : 'GENERATE'}
                      </span>
                  </div>

                  {/* Favorite Button (Top Right) */}
                  <button 
                    onClick={(e) => toggleFavorite(e, item.title)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:bg-black/60 hover:text-red-500 hover:scale-110 transition-all z-10"
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                     <svg className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                      <span>{item.category}</span>
                      <span className="truncate max-w-[80px]">{item.author}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-banana-400 transition-colors">
                      {item.title}
                  </h3>
                  
                  {/* Hover Actions */}
                  <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                          <div className="pt-3 flex gap-2">
                              <button className="flex-1 rounded-lg bg-white/10 border border-white/10 text-white py-2 text-xs font-bold hover:bg-banana-500 hover:text-black hover:border-banana-500 transition-all">
                                  {t.gallery.use_prompt}
                              </button>
                              <button 
                                onClick={(e) => handleCopy(e, item.prompt, item.title)}
                                className={`aspect-square w-10 flex items-center justify-center rounded-lg border transition-all ${
                                  isCopied 
                                    ? 'bg-banana-500/20 border-banana-500 text-banana-400' 
                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                                title={t.gallery.copy_prompt}
                              >
                                  {isCopied ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                  )}
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            )})
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                    {viewMode === 'favorites' 
                        ? (language === 'ru' ? 'В избранном пока пусто.' : 'No favorites yet.')
                        : 'No prompts found matching your criteria.'}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
