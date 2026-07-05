"use client";

import React, { useState } from 'react';
import { FileDigit, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import confetti from 'canvas-confetti';

function NumberPages() {
  const [file, setFile] = useState(null);
  const [verticalPos, setVerticalPos] = useState('bottom');
  const [horizontalPos, setHorizontalPos] = useState('center');
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
      formData.append('task', 'pagenumber');
      formData.append('vertical_position', verticalPos);
      formData.append('horizontal_position', horizontalPos);

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-numbered.pdf`;
      
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
          Vertical Position
        </label>
        <select
          value={verticalPos}
          onChange={(e) => setVerticalPos(e.target.value)}
          disabled={isExecuting}
          className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Horizontal Position
        </label>
        <select
          value={horizontalPos}
          onChange={(e) => setHorizontalPos(e.target.value)}
          disabled={isExecuting}
          className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Number Pages",
    "url": "https://wordtopdfconverter.online/number-pages",
    "description": "Add page numbers to your PDF.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Add Page Numbers to PDF</h1>
        <p className="text-slate-400 text-lg">
          Insert page numbers into your PDF document easily.
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
        title="Number Pages"
        description="Add page numbers to your PDF documents."
        icon={FileDigit}
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

export default NumberPages;
