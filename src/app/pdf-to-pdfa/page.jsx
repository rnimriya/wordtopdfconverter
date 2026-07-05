"use client";

import React, { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import confetti from 'canvas-confetti';

function PDFtoPDFA() {
  const [file, setFile] = useState(null);
  const [conformance, setConformance] = useState('pdfa-2b');
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'pdfa');
      formData.append('conformance', conformance);

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-pdfa.pdf`;
      
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
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Conformance Level
        </label>
        <select
          value={conformance}
          onChange={(e) => setConformance(e.target.value)}
          disabled={isExecuting}
          className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="pdfa-1b">PDF/A-1b (Basic)</option>
          <option value="pdfa-2b">PDF/A-2b (Recommended)</option>
          <option value="pdfa-3b">PDF/A-3b (Advanced)</option>
        </select>
      </div>

      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          ISO Standard Compliance
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          Converts your document into an ISO-standardized version for long-term archiving.
        </p>
      </div>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF To PDF/A",
    "url": "https://wordtopdfconverter.online/pdf-to-pdfa",
    "description": "Convert PDF files into PDF/A for archiving.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Convert PDF to PDF/A</h1>
        <p className="text-slate-400 text-lg">
          Make your PDF documents ISO compliant for long-term archiving with our secure PDF/A converter.
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
        title="PDF To PDF/A"
        description="Convert PDF to PDF/A for long term archiving."
        icon={FileText}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
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

export default PDFtoPDFA;
