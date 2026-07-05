"use client";

import React, { useState } from 'react';
import { Languages, Loader2, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';
import confetti from 'canvas-confetti';

function TranslatePdf() {
  const [file, setFile] = useState(null);
  const [translation, setTranslation] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setTranslation('');
    setErrorMessage('');
    
    try {
      const text = await extractTextFromPdf(selectedFile);
      if (!text || text.trim().length === 0) {
        throw new Error("Could not extract any text from this PDF.");
      }
      setDocumentText(text);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to extract text from PDF.");
    } finally {
      setLoadingText(false);
    }
  };

  const handleTranslate = async () => {
    if (!file || !documentText) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'translate',
          documentText: documentText,
          language: targetLanguage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      setTranslation(data.result);
      setSuccessMessage("Translation generated successfully!");
      
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Target Language
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          disabled={isExecuting || loadingText}
          className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Chinese (Simplified)">Chinese (Simplified)</option>
          <option value="Japanese">Japanese</option>
          <option value="English">English</option>
        </select>
      </div>

      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          AI Translation
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          Translates the extracted text into the selected language using AI.
        </p>
      </div>

      <button 
        onClick={handleTranslate} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || loadingText || isExecuting || !documentText}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Translating...</span>
          </>
        ) : (
          <>
            <Languages className="h-4 w-4" />
            <span>Translate PDF</span>
          </>
        )}
      </button>
      
      {loadingText && (
        <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center animate-pulse">
          Extracting text from PDF layout...
        </div>
      )}

      {translation && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-2">Translation Result</h3>
          <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
            {translation}
          </div>
        </div>
      )}
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Translate PDF",
    "url": "https://wordtopdfconverter.online/translate-pdf",
    "description": "Translate PDF text into multiple languages.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Translate PDF Online</h1>
        <p className="text-slate-400 text-lg">
          Instantly translate your PDF documents into various languages.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ToolLayout
        title="Translate PDF"
        description="Translate your PDF into any language instantly."
        icon={Languages}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setTranslation(''); setDocumentText(''); setSuccessMessage(''); setErrorMessage(''); }}
        controls={controls}
        onExecute={handleTranslate}
        isExecuting={isExecuting || loadingText}
        progress={isExecuting ? 50 : 0}
        successMessage={successMessage}
        errorMessage={errorMessage}
        seoContent={seoContent}
        preview={<PDFPreview file={file} pageNumber={1} scale={0.8} />}
      />
    </>
  );
}

export default TranslatePdf;
