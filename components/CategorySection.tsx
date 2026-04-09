import React from 'react';
import { PromptExample } from '../types';
import { getCategoryColor, getCategoryStats, formatCategoryStats } from '../utils/categoryHelpers';

interface CategorySectionProps {
  category: string;
  prompts: PromptExample[];
  onSelectPrompt: (prompt: PromptExample) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, title: string) => void;
  onCopy: (e: React.MouseEvent, prompt: string, title: string) => void;
  copyStatus: string | null;
}

// SVG icons per category — no emojis
const CATEGORY_SVG_ICONS: Record<string, React.ReactNode> = {
  'Art & Illustration': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'Design & Business': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'Realism & Photo': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'Creative Art': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  'Fun & Social': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Learning & Utility': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'UI & Design': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
};

const DEFAULT_CATEGORY_ICON = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// SVG heart icons
const HeartSolid = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const HeartOutline = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// SVG copy / check icons
const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

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
  const stats = getCategoryStats(prompts);
  const statsStr = formatCategoryStats(stats);
  const categoryIcon = CATEGORY_SVG_ICONS[category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <section className="mb-12">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text} flex-shrink-0`}>
            {categoryIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`text-2xl font-bold ${colors.text} mb-1`}>
              {category}
            </h2>
            <p className="text-sm text-gray-400">{statsStr}</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mt-4" />
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {prompts.map((prompt) => {
          const isFav = favorites.includes(prompt.title);
          const isCopied = copyStatus === prompt.title;

          return (
            <article
              key={prompt.title}
              className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 bg-neutral-900/50 backdrop-blur-sm cursor-pointer"
              onClick={() => onSelectPrompt(prompt)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-neutral-800 aspect-square">
                <img
                  src={prompt.preview}
                  alt={prompt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Gradient Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Mode Badge — always visible, top-left */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      prompt.mode === 'generate'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {prompt.mode === 'generate' ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Generate
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </>
                    )}
                  </span>
                </div>

                {/* Favorite Button — always visible for touch accessibility */}
                <button
                  type="button"
                  onClick={(e) => onToggleFavorite(e, prompt.title)}
                  aria-label={isFav ? `Remove "${prompt.title}" from favorites` : `Add "${prompt.title}" to favorites`}
                  aria-pressed={isFav}
                  className={`absolute top-2 right-2 p-2 rounded-lg border transition-all duration-200
                    ${isFav
                      ? 'bg-red-500/20 border-red-400/40 text-red-400'
                      : 'bg-black/50 border-white/10 text-gray-400 opacity-60 group-hover:opacity-100 hover:border-red-400/40 hover:text-red-400 hover:bg-red-500/20'
                    }`}
                >
                  {isFav ? <HeartSolid /> : <HeartOutline />}
                </button>

                {/* Hover Action: Use Prompt — desktop only, visible on hover */}
                <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSelectPrompt(prompt); }}
                    aria-label={`Use prompt: ${prompt.title}`}
                    className="w-full px-3 py-2 bg-banana-500 text-black font-semibold rounded-lg hover:bg-banana-400 transition-colors text-sm"
                  >
                    Use Prompt
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-white group-hover:text-banana-400 transition-colors line-clamp-2">
                  {prompt.title}
                </h3>

                <div className="flex items-center justify-between text-xs gap-2">
                  <span className={`${colors.text} font-medium px-2 py-1 rounded ${colors.bg} truncate`}>
                    {category}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-500 truncate max-w-[80px]">{prompt.author}</span>

                    {/* Copy button — always visible */}
                    <button
                      type="button"
                      onClick={(e) => onCopy(e, prompt.prompt, prompt.title)}
                      aria-label={isCopied ? 'Copied!' : `Copy prompt: ${prompt.title}`}
                      title={isCopied ? 'Copied!' : 'Copy prompt'}
                      className={`p-1.5 rounded-md transition-all duration-200 border ${
                        isCopied
                          ? 'bg-banana-500/20 border-banana-500/30 text-banana-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
