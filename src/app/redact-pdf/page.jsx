"use client";

import React, { useState } from 'react';
import { Eraser, Loader2, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { editPdfLocal } from '../../utils/pdfEditor.js';
import confetti from 'canvas-confetti';

function RedactPDF() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleExecute = async () => {
    if (!file) return;
    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);
    try {
      setProgress(50);
      const blob = await editPdfLocal(file, { task: 'redact', text });
      setProgress(90);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const downloadName = file.name.replace(/\.[^/.]+$/, '') + '-redact.pdf';
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setProgress(100);
      setSuccessMessage('Processing successful! Download initialized.');
      if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      setErrorMessage('Error processing document: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          Client-Side Processing
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          Your document is securely processed entirely within your browser for absolute privacy.
        </p>
      </div>
      
      <button onClick={handleExecute} className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" disabled={!file || isExecuting}>
        {isExecuting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /><span>Processing...</span></>
        ) : (
          <><Eraser className="h-4 w-4" /><span>Redact PDF</span></>
        )}
      </button>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Redact PDF",
    "url": "https://wordtopdfconverter.online/redact-pdf",
    "description": "Redact PDF locally in your browser.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Secure Redact PDF - 100% Private Local Processing</h1>
        <p className="text-slate-400 text-lg">
          Process your documents directly in your browser. No files are uploaded to any server, guaranteeing absolute privacy.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolLayout
        title="Redact PDF"
        description="Process your PDF locally in your browser with absolute privacy."
        icon={Eraser}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); setText(''); }}
        controls={controls}
        onExecute={handleExecute}
        isExecuting={isExecuting}
        progress={progress}
        successMessage={successMessage}
        errorMessage={errorMessage}
        seoContent={seoContent}
        preview={<PDFPreview file={file} pageNumber={1} scale={0.8} />}
      />
    </>
  );
}

export default RedactPDF;