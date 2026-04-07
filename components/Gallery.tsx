
import React, { useState, useMemo } from 'react';
import { PROMPT_EXAMPLES } from '../data';
import { PromptExample, ViewMode } from '../types';
import { useLanguage } from '../LanguageContext';
import CategorySection from './CategorySection';
import { groupPromptsByCategory, sortCategories, getAllCategories } from '../utils/categoryHelpers';

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

  // Filter prompts based on Mode, Category, and Search Query
  const filteredPrompts = useMemo(() => {
    return PROMPT_EXAMPLES.filter(p => {
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
  }, [viewMode, categoryFilter, searchQuery, favorites]);

  // Group filtered prompts by category
  const groupedPrompts = useMemo(() => {
    return groupPromptsByCategory(filteredPrompts);
  }, [filteredPrompts]);

  // Extract and sort categories dynamically based on the current view mode
  const categories = useMemo(() => {
    let promptsInMode = PROMPT_EXAMPLES;

    if (viewMode === 'favorites') {
        promptsInMode = PROMPT_EXAMPLES.filter(p => favorites.includes(p.title));
    } else if (viewMode !== 'all') {
        promptsInMode = PROMPT_EXAMPLES.filter(p => p.mode === viewMode);
    }

    const allCategories = getAllCategories(promptsInMode);
    const sorted = sortCategories(allCategories);
    return ['All', ...sorted];
  }, [viewMode, favorites]);

  // Get visible categories based on filter
  const visibleCategories = useMemo(() => {
    if (categoryFilter === 'All') {
      return Object.keys(groupedPrompts).length > 0
        ? sortCategories(Object.keys(groupedPrompts))
        : [];
    }
    return categoryFilter in groupedPrompts ? [categoryFilter] : [];
  }, [groupedPrompts, categoryFilter]);

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

          {/* Enhanced Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-full">
            {categories.map((cat) => {
              const prompCount = cat === 'All'
                ? filteredPrompts.length
                : groupedPrompts[cat]?.length || 0;

              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 border ${
                    categoryFilter === cat
                      ? 'bg-banana-500 border-banana-500 text-black shadow-lg shadow-banana-500/20'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat === 'All' ? t.gallery.tab_all : cat}
                  {categoryFilter !== cat && (
                    <span className="ml-2 opacity-70">({prompCount})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Sections */}
        {filteredPrompts.length > 0 ? (
          <div className="space-y-4">
            {visibleCategories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                prompts={groupedPrompts[category] || []}
                onSelectPrompt={onSelectPrompt}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onCopy={handleCopy}
                copyStatus={copyStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">
              {viewMode === 'favorites'
                  ? (language === 'ru' ? 'В избранном пока пусто.' : 'No favorites yet.')
                  : (language === 'ru' ? 'Промпты не найдены.' : 'No prompts found matching your criteria.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
