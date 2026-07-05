"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';
import confetti from 'canvas-confetti';

function SummarizePdf() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setSummary('');
    setErrorMessage('');
    
    try {
      const text = await extractTextFromPdf(selectedFile);
      if (!text || text.trim().length === 0) {
        throw new Error("Could not extract any text from this PDF. It might be scanned or empty.");
      }
      setDocumentText(text);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to extract text from PDF.");
    } finally {
      setLoadingText(false);
    }
  };

  const handleSummarize = async () => {
    if (!file || !documentText) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'summarize',
          documentText: documentText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      setSummary(data.result);
      setSuccessMessage("Summary generated successfully!");
      
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
      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          AI Analysis
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This tool uses AI to read the text of your document and generate a structured summary.
        </p>
      </div>

      <button 
        onClick={handleSummarize} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || loadingText || isExecuting || !documentText}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Summarizing...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Summary</span>
          </>
        )}
      </button>
      
      {loadingText && (
        <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center animate-pulse">
          Extracting text from PDF layout...
        </div>
      )}

      {summary && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-2">Generated Summary</h3>
          <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
        </div>
      )}
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI PDF Summarizer",
    "url": "https://wordtopdfconverter.online/ai-pdf-summarizer",
    "description": "Create concise structured text summaries of any PDF document.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">AI PDF Summarizer</h1>
        <p className="text-slate-400 text-lg">
          Create concise, structured summaries of any PDF document instantly.
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
        title="AI PDF Summarizer"
        description="Create concise structured text summaries of any PDF document."
        icon={Sparkles}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setSummary(''); setDocumentText(''); setSuccessMessage(''); setErrorMessage(''); }}
        controls={controls}
        onExecute={handleSummarize}
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

export default SummarizePdf;
