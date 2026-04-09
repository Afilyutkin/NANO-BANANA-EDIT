import { PromptExample } from '../types';

// Category color schemes
export const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  'Art & Illustration': {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    accent: '#8b5cf6'
  },
  'Design & Business': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    accent: '#3b82f6'
  },
  'Realism & Photo': {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    accent: '#06b6d4'
  },
  'Creative Art': {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    accent: '#ec4899'
  },
  'Fun & Social': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    accent: '#f97316'
  },
  'Learning & Utility': {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    accent: '#10b981'
  },
  'UI & Design': {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    accent: '#6366f1'
  }
};

// Get color scheme for a category
export const getCategoryColor = (category: string) => {
  return categoryColors[category] || categoryColors['Art & Illustration'];
};

// Group prompts by category
export const groupPromptsByCategory = (
  prompts: PromptExample[]
): Record<string, PromptExample[]> => {
  const grouped: Record<string, PromptExample[]> = {};

  prompts.forEach(prompt => {
    const category = prompt.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(prompt);
  });

  return grouped;
};

// Get statistics for prompts in a category
export const getCategoryStats = (prompts: PromptExample[]) => {
  const stats = {
    total: prompts.length,
    generate: 0,
    edit: 0
  };

  prompts.forEach(prompt => {
    if (prompt.mode === 'generate') {
      stats.generate++;
    } else if (prompt.mode === 'edit') {
      stats.edit++;
    }
  });

  return stats;
};

// Sort categories in a consistent order
export const sortCategories = (categories: string[]): string[] => {
  const preferredOrder = [
    'Art & Illustration',
    'Design & Business',
    'Realism & Photo',
    'Creative Art',
    'Fun & Social',
    'Learning & Utility',
    'UI & Design'
  ];

  return categories.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a);
    const bIndex = preferredOrder.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
};

// Get all unique categories from prompts
export const getAllCategories = (prompts: PromptExample[]): string[] => {
  const categories = new Set(prompts.map(p => p.category || 'Other'));
  return Array.from(categories);
};

// Format statistics string
export const formatCategoryStats = (stats: ReturnType<typeof getCategoryStats>): string => {
  const parts = [
    `${stats.total} ${stats.total === 1 ? 'prompt' : 'prompts'}`
  ];

  if (stats.generate > 0) {
    parts.push(`${stats.generate} generate`);
  }

  if (stats.edit > 0) {
    parts.push(`${stats.edit} edit`);
  }

  return parts.join(' • ');
};
