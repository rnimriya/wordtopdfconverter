"use client";

import React, { useState } from 'react';
import { ImageDown, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import confetti from 'canvas-confetti';

function ExtractImages() {
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

  const handleExecute = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'pdfjpg');
      formData.append('pdfjpg_mode', 'extract');

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
      
      let downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-images`;
      
      if (blob.type === 'application/zip') {
        downloadName += '.zip';
      } else {
        downloadName += '.jpg';
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
      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          Image Extraction
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This will extract all embedded images from the PDF document and download them as a ZIP file.
        </p>
      </div>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract Images",
    "url": "https://wordtopdfconverter.online/extract-images",
    "description": "Extract images from PDF files.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Extract Images from PDF</h1>
        <p className="text-slate-400 text-lg">
          Extract all embedded images from your PDF document in seconds.
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
        title="Extract Images"
        description="Extract all images embedded in a PDF file."
        icon={ImageDown}
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

export default ExtractImages;
