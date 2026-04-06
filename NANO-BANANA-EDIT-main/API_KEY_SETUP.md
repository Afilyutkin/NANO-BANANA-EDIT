# Nano Banana API Key Configuration Guide

## Overview

Nano Banana Editor now supports easy API key configuration directly through the application UI. Your API key is stored securely in your browser's localStorage.

## Getting Your API Key

1. Visit [Google AI Studio](https://ai.google.dev/gemini-api/docs/billing)
2. Sign in with your Google account
3. Create or select your project
4. Click on "Get API Key"
5. Copy your API key

## Setting Up Your API Key

### Method 1: Using the Application UI (Recommended)

1. Open the application in your browser
2. Click the **Settings** icon (⚙️) in the header
3. Paste your API key in the input field
4. Click **"Save Key"**
5. You'll see a success message confirming the key was saved
6. Close the modal and start using the editor!

**Note:** Your API key is stored in your browser's localStorage and is not sent to any server. It only gets sent to Google's Gemini API when you generate or edit images.

### Method 2: Environment Variables (Development Only)

For development purposes, you can also set the API key via environment variables:

```bash
# Create a .env file in the project root
VITE_API_KEY=your_api_key_here
```

Then update your `vite.config.ts` to expose it:

```typescript
export default defineConfig({
  define: {
    'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  },
})
```

## Managing Your API Key

### Viewing Key Status

Open Settings to see if your API key is currently configured:
- 🟢 **Green status** = API Key Active
- 🟡 **Yellow status** = API Key Missing

### Updating Your Key

1. Open Settings
2. Clear the input field
3. Paste your new API key
4. Click "Save Key"

### Removing Your Key

1. Open Settings
2. Click the "Remove Key" button
3. Confirm the deletion

This will completely remove the key from your browser's localStorage.

## Security Notes

- ✅ Your API key is stored **only in your browser**
- ✅ It is **never sent to any server** except Google's Gemini API
- ✅ You have full control to delete it anytime
- ⚠️ Do not share your API key with others
- ⚠️ Do not commit your API key to version control
- ⚠️ Keep your API key confidential

## Troubleshooting

### "API Key Missing" Error
If you see this error when trying to generate images:
1. Check Settings to confirm your API key is saved
2. If not saved, follow the "Setting Up Your API Key" section above
3. Make sure you copied the entire key without extra spaces

### "Invalid API Key" Error
- Verify you're using the correct API key from Google AI Studio
- Make sure the key hasn't expired
- Check that you don't have extra spaces in the key

### Key Not Persisting
- Check if your browser allows localStorage
- Try clearing browser cache and re-entering the key
- Try a different browser

## File Structure

```
utils/
  └── apiKeyManager.ts    # API Key storage utilities
components/
  └── SettingsModal.tsx   # Settings UI component
services/
  └── geminiService.ts    # Gemini API integration
```

## Environment

The API key manager automatically detects whether it's running in a browser environment and handles both client-side and server-side scenarios appropriately.
