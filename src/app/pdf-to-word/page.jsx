"use client";

import React, { useState } from 'react';
import { FileText, ArrowRightLeft, Loader2, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPDF, createDocxFromPages } from '../../utils/docxParser.js';
import confetti from 'canvas-confetti';

function PdfToWord() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      setProgress(30);
      
      // Extract text locally from PDF
      const { text, pages } = await extractTextFromPDF(file, (p) => {
        setProgress(30 + Math.floor(p * 0.4)); // 30% to 70%
      });
      
      if (!pages || pages.length === 0) {
        throw new Error("Could not extract any text from this PDF. It might be scanned or empty.");
      }

      setProgress(80);

      // Create native DOCX blob locally
      const blob = await createDocxFromPages(pages);
      
      setProgress(90);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-converted.docx`;
      
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setProgress(100);
      setSuccessMessage("Processing successful! Download initialized.");
      
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error converting document: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
        <ArrowRightLeft className="h-4 w-4" />
        <span>Local Extraction Engine</span>
      </div>
      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          Client-Side Processing
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          Your document is securely processed entirely within your browser. No files are uploaded to our servers, ensuring 100% privacy.
        </p>
      </div>
      <button 
        onClick={handleConvert} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || isExecuting}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Converting...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            <span>Convert to Word</span>
          </>
        )}
      </button>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF To Word",
    "url": "https://wordtopdfconverter.online/pdf-to-word",
    "description": "A secure, fast, and free online tool to convert PDF to Word locally.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Secure PDF To Word - 100% Private Local Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online PDF To Word tool converts your documents directly in your browser. No files are uploaded, guaranteeing absolute privacy and zero risk of interception.
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
        title="PDF To Word"
        description="Convert PDF to Word locally in your browser with absolute privacy."
        icon={FileText}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
        controls={controls}
        onExecute={handleConvert}
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

export default PdfToWord;
