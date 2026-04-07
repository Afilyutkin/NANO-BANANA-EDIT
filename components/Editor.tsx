
import React, { useState, useRef, useEffect } from 'react';
import { PromptExample, ProcessingStatus } from '../types';
import { generateContent } from '../services/geminiService';
import { useLanguage } from '../LanguageContext';

interface EditorProps {
  initialPrompt?: PromptExample | null;
}

const MAX_IMAGES = 6;

const Editor: React.FC<EditorProps> = ({ initialPrompt }) => {
  const [promptText, setPromptText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [systemStyle, setSystemStyle] = useState<string>('default');
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Dynamic System Styles based on translations
  const SYSTEM_STYLES = [
    { value: 'default', label: t.editor.style_default, instruction: '' },
    { value: 'formal', label: t.editor.style_formal, instruction: 'You are a precise and formal image editing assistant. Follow instructions exactly with professional attention to detail and realistic rendering.' },
    { value: 'casual', label: t.editor.style_casual, instruction: 'You are a creative and casual artist. Feel free to interpret prompts loosely and artistically.' },
    { value: 'humorous', label: t.editor.style_humorous, instruction: 'You are a witty assistant. Add a touch of humor and personality to your creations.' },
    { value: 'cinematic', label: t.editor.style_cinematic, instruction: 'You are a world-class cinematographer. Focus on dramatic lighting, composition, and high production value.' },
    { value: 'surreal', label: t.editor.style_surreal, instruction: 'You are a surrealist artist. Create dreamlike, abstract, and imaginative imagery.' },
  ];

  useEffect(() => {
    if (initialPrompt) {
      setPromptText(initialPrompt.prompt);
      if (initialPrompt.mode === 'generate') {
          setSelectedImages([]);
      }
    }
  }, [initialPrompt]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - selectedImages.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    try {
        const readPromises = filesToProcess.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });

        const newImages = await Promise.all(readPromises);
        setSelectedImages(prev => [...prev, ...newImages]);
        setResultImage(null); // Clear previous result
    } catch (error) {
        console.error("Error reading files", error);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopyPrompt = () => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText).then(() => {
      setIsCopied(true);
      // Fix: Reset to boolean false instead of null
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleProcess = async () => {
    if (!promptText) return;
    
    setStatus('loading');
    setErrorMsg(null);
    setResultImage(null);

    try {
      const selectedStyle = SYSTEM_STYLES.find(s => s.value === systemStyle);
      const instruction = selectedStyle?.instruction;

      const response = await generateContent(promptText, selectedImages, instruction);
      setResultImage(response);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      
      let message = t.editor.error_generic;
      const rawMsg = err.message || '';
      if (rawMsg.includes('MISSING_API_KEY')) message = t.editor.error_missing_key;
      else if (rawMsg.includes('No candidates')) message = t.editor.error_no_candidates;
      else if (rawMsg.includes('returned text')) message = t.editor.error_text_response;
      else if (rawMsg.includes('No image data')) message = t.editor.error_no_image;
      else if (rawMsg) message = rawMsg;

      setErrorMsg(message);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-950 p-4 md:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-banana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t.editor.reference_images}
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={triggerFileInput}
                        className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t.editor.add_image}
                    </button>
                    <span className="text-xs text-gray-400 font-medium">{selectedImages.length} / {MAX_IMAGES}</span>
                </div>
            </div>
            
            {selectedImages.length === 0 ? (
                // Empty State - Big Drop Zone
                <div 
                    className="relative group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-800/50 hover:border-banana-500 hover:bg-neutral-800 transition-all"
                    onClick={triggerFileInput}
                >
                    <div className="text-center p-6">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-700 text-banana-500 group-hover:scale-110 transition-transform">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-300">{t.editor.upload_placeholder_title}</p>
                        <p className="mt-1 text-xs text-gray-500">{t.editor.upload_placeholder_subtitle}</p>
                    </div>
                </div>
            ) : (
                // Grid View
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border border-white/10 bg-black overflow-hidden group">
                            <img src={img} alt={`Reference ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="rounded-full bg-red-500/90 p-2 text-white hover:bg-red-600 transition-colors transform hover:scale-110"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {selectedImages.length < MAX_IMAGES && (
                        <button 
                            onClick={triggerFileInput}
                            className="aspect-square rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-800/30 flex flex-col items-center justify-center text-gray-500 hover:border-banana-500 hover:text-banana-500 hover:bg-neutral-800 transition-all"
                        >
                            <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs font-medium">{t.editor.add_image}</span>
                        </button>
                    )}
                </div>
            )}
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={handleImageUpload} 
            />
          </div>

          <div className="flex-1 rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-banana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t.editor.magic_prompt}
                </h2>
                <button 
                  onClick={handleCopyPrompt}
                  disabled={!promptText}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCopied 
                      ? 'bg-banana-500/20 text-banana-400 border border-banana-500/30' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                  } ${!promptText ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {isCopied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {/* Fix: Directly use t.gallery.copied instead of undefined translations object */}
                        {t.gallery.copied}
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        {t.editor.btn_copy}
                      </>
                    )}
                </button>
            </div>

            <div className="mb-4">
               <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-banana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-300">{t.editor.style_label}</span>
               </div>
               <div className="relative">
                   <select
                        value={systemStyle}
                        onChange={(e) => setSystemStyle(e.target.value)}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800 p-3 pr-10 text-white focus:border-banana-500 focus:outline-none focus:ring-1 focus:ring-banana-500 appearance-none cursor-pointer hover:bg-neutral-750 transition-colors"
                   >
                        {SYSTEM_STYLES.map(style => (
                            <option key={style.value} value={style.value}>{style.label}</option>
                        ))}
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                   </div>
               </div>
            </div>

            <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={t.editor.prompt_placeholder}
                className="w-full flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-800 p-4 text-white placeholder-gray-500 focus:border-banana-500 focus:outline-none focus:ring-1 focus:ring-banana-500"
            />
            
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleProcess}
                    disabled={status === 'loading' || !promptText}
                    className={`flex items-center gap-2 rounded-xl px-8 py-4 font-bold transition-all ${
                        status === 'loading' || !promptText
                            ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-banana-500 to-banana-600 text-black hover:from-banana-400 hover:to-banana-500 shadow-lg hover:shadow-banana-500/20'
                    }`}
                >
                    {status === 'loading' ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.editor.btn_processing}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {t.editor.btn_generate}
                        </>
                    )}
                </button>
            </div>
            {errorMsg && (
                <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                    {t.editor.error_prefix} {errorMsg}
                </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl flex flex-col">
            <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-banana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t.editor.result_title}
            </h2>
            <div className="flex-1 flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/30 overflow-hidden relative min-h-[400px]">
                {resultImage ? (
                    <img src={resultImage} alt="Generated Result" className="w-full h-full object-contain animate-in fade-in duration-700" />
                ) : (
                    <div className="text-center p-8">
                         {status === 'loading' ? (
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 border-4 border-banana-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-400 animate-pulse">{t.editor.result_placeholder_loading}</p>
                             </div>
                         ) : (
                            <div className="flex flex-col items-center text-gray-600">
                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                <p>{t.editor.result_placeholder_empty}</p>
                            </div>
                         )}
                    </div>
                )}
            </div>
            {resultImage && (
                <div className="mt-4 flex justify-end">
                    <a 
                        href={resultImage} 
                        download="banana-edit-result.png"
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                    >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t.editor.btn_download}
                    </a>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
