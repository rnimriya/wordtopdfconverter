"use client";

import React, { useState } from 'react';
import { RotateCw, Sparkles, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import confetti from 'canvas-confetti';

function RotatePdf() {
  const [file, setFile] = useState(null);
  const [rotationAngle, setRotationAngle] = useState('90');
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleRotate = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'rotate');
      formData.append('rotate', rotationAngle);

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-rotated.pdf`;
      
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
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
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
          Rotation Angle
        </label>
        <select
          value={rotationAngle}
          onChange={(e) => setRotationAngle(e.target.value)}
          disabled={isExecuting}
          className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="90">Rotate Right (90°)</option>
          <option value="270">Rotate Left (90°)</option>
          <option value="180">Rotate 180°</option>
        </select>
      </div>

      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          Global Rotation
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This will rotate all pages in the PDF document by the selected angle.
        </p>
      </div>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Rotate PDF",
    "url": "https://wordtopdfconverter.online/rotate-pdf",
    "description": "Rotate your PDF files online for free.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Rotate PDF Online</h1>
        <p className="text-slate-400 text-lg">
          Instantly rotate your PDF document pages. Perfect for fixing upside-down scans.
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
        title="Rotate PDF"
        description="Rotate all pages in your PDF document instantly."
        icon={RotateCw}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={clearFile}
        controls={controls}
        onExecute={handleRotate}
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

export default RotatePdf;
