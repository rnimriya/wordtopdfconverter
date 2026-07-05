"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';

function SummarizePdf() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setSummary('');
    const text = await extractTextFromPdf(selectedFile);
    setDocumentText(text);
    setLoadingText(false);
  };

  const handleSummarize = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'unsupported');

      setProgress(30);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      setProgress(80);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let downloadName = 'processed-document.pdf';
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-unsupported.pdf`;
      
      // ILovePDF can return zips for some tasks
      if (blob.type === 'application/zip') {
        downloadName = downloadName.replace('.pdf', '.zip');
      }

      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setProgress(100);
      setSuccessMessage("Processing successful! Download initialized.");
      
      // Ensure confetti is called if available, else skip
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error processing document: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <button 
        onClick={handleSummarize} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || loadingText || isExecuting}
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
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500 text-center animate-pulse">
          Extracting text from PDF layout...
        </div>
      )}

      {summary && (
        <div className="p-4 border rounded-xl bg-slate-50 text-xs text-slate-750 font-mono whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
          {summary}
        </div>
      )}
    </div>
  );

  return (
    <>
      <ToolLayout
      title="AI PDF Summarizer"
      description="Create concise structured text summaries and key outlines of any PDF document."
      icon={Sparkles}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={() => { setFile(null); setSummary(''); setDocumentText(''); }}
      controls={controls}
      onExecute={handleSummarize}
      isExecuting={isExecuting || loadingText}
    />
    </>
  );
}

export default SummarizePdf;
