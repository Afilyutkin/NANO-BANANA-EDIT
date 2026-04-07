import React, { useState } from 'react';
import { PromptExample } from '../types';
import { getCategoryColor, getCategoryIcon, getCategoryStats, formatCategoryStats } from '../utils/categoryHelpers';

interface CategorySectionProps {
  category: string;
  prompts: PromptExample[];
  onSelectPrompt: (prompt: PromptExample) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, title: string) => void;
  onCopy: (e: React.MouseEvent, prompt: string, title: string) => void;
  copyStatus: string | null;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  prompts,
  onSelectPrompt,
  favorites,
  onToggleFavorite,
  onCopy,
  copyStatus
}) => {
  const colors = getCategoryColor(category);
  const icon = getCategoryIcon(category);
  const stats = getCategoryStats(prompts);
  const statsStr = formatCategoryStats(stats);

  return (
    <section className="mb-12 animate-fade-in">
      {/* Category Header */}
      <div className="mb-8">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center text-2xl`}>
            {icon}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${colors.text} mb-1`}>
              {category}
            </h2>
            <p className="text-sm text-gray-400">
              {statsStr}
            </p>
          </div>
        </div>

        {/* Gradient Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mt-4"></div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {prompts.map((prompt) => (
          <div
            key={prompt.title}
            className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 bg-neutral-900/50 backdrop-blur-sm cursor-pointer animate-fade-in"
            onClick={() => onSelectPrompt(prompt)}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-neutral-800 aspect-square">
              <img
                src={prompt.preview}
                alt={prompt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Mode Badge - Top Left */}
              <div className="absolute top-3 left-3 opacity-100 group-hover:opacity-100 transition-opacity">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    prompt.mode === 'generate'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {prompt.mode === 'generate' ? '✨ Generate' : '✏️ Edit'}
                </span>
              </div>

              {/* Favorite Button - Top Right */}
              <button
                onClick={(e) => onToggleFavorite(e, prompt.title)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-banana-500/20 border border-white/10 hover:border-banana-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Add to favorites"
              >
                <span className={`text-lg ${favorites.includes(prompt.title) ? '❤️' : '🤍'}`}>
                  {favorites.includes(prompt.title) ? '❤️' : '🤍'}
                </span>
              </button>

              {/* Hover Actions - Bottom */}
              <div className="absolute bottom-0 inset-x-0 p-3 gap-2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onSelectPrompt(prompt)}
                  className="flex-1 px-3 py-2 bg-banana-500 text-black font-semibold rounded-lg hover:bg-banana-400 transition-colors text-sm"
                >
                  Use Prompt
                </button>
                <button
                  onClick={(e) => onCopy(e, prompt.prompt, prompt.title)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm font-medium border border-white/10"
                  title="Copy prompt"
                >
                  {copyStatus === prompt.title ? '✓' : '📋'}
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 space-y-2">
              {/* Title */}
              <h3 className="font-semibold text-sm text-white group-hover:text-banana-400 transition-colors line-clamp-2">
                {prompt.title}
              </h3>

              {/* Metadata Row */}
              <div className="flex items-center justify-between text-xs">
                <span className={`${colors.text} font-medium px-2 py-1 rounded ${colors.bg}`}>
                  {category}
                </span>
                <span className="text-gray-500 truncate">
                  {prompt.author}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
