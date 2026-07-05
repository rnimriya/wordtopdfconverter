"use client";

import React, { useState } from 'react';
import { MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';
import confetti from 'canvas-confetti';

function ChatWithPdf() {
  const [file, setFile] = useState(null);
  const [answer, setAnswer] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setAnswer('');
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

  const handleChat = async () => {
    if (!file || !documentText || !prompt.trim()) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'chat',
          documentText: documentText,
          customPrompt: prompt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      setAnswer(data.result);
      setSuccessMessage("Answer received!");
      
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
          Ask a Question
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isExecuting || loadingText}
          placeholder="What is this document about?"
          className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none h-24"
        />
      </div>

      <button 
        onClick={handleChat} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || loadingText || isExecuting || !documentText || !prompt.trim()}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            <span>Ask Document</span>
          </>
        )}
      </button>
      
      {loadingText && (
        <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center animate-pulse">
          Extracting text from PDF layout...
        </div>
      )}

      {answer && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-2">Answer</h3>
          <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        </div>
      )}
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chat with PDF",
    "url": "https://wordtopdfconverter.online/chat-with-pdf",
    "description": "Talk to your PDF and ask questions.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Chat With PDF</h1>
        <p className="text-slate-400 text-lg">
          Ask questions and get answers directly from your PDF document.
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
        title="Chat With PDF"
        description="Interact and ask questions based on your PDF."
        icon={MessageSquare}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setAnswer(''); setPrompt(''); setDocumentText(''); setSuccessMessage(''); setErrorMessage(''); }}
        controls={controls}
        onExecute={handleChat}
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

export default ChatWithPdf;
