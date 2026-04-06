/**
 * API Key Manager - handles storage and retrieval of Nano Banana API key
 */

const API_KEY_STORAGE_KEY = 'NANO_BANANA_API_KEY';

export const apiKeyManager = {
  /**
   * Get the stored API key from localStorage
   */
  getApiKey: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  },

  /**
   * Check if API key is configured
   */
  isConfigured: (): boolean => {
    return apiKeyManager.getApiKey().length > 0;
  },

  /**
   * Save API key to localStorage
   */
  setApiKey: (key: string): void => {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    }
  },

  /**
   * Remove API key from localStorage
   */
  removeApiKey: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  /**
   * Validate API key format (basic check)
   */
  isValidFormat: (key: string): boolean => {
    // Gemini API keys typically start with 'AIza' and are quite long
    return key.trim().length > 20;
  },
};
