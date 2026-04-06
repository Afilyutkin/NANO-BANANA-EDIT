
export interface PromptExample {
  title: string;
  preview: string;
  prompt: string;
  author: string;
  link?: string;
  mode: 'edit' | 'generate';
  category: string;
}

export type ProcessingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface GeneratedImage {
  url: string;
  prompt: string;
  originalImage?: string; // If it was an edit
}

export type ViewMode = 'all' | 'generate' | 'edit' | 'favorites';
