"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, RotateCcw, Check, CheckSquare, Square, FileText, ArrowRight, Grid, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { rotatePDF } from '../../utils/pdfProcessor.js';
import * as pdfjs from 'pdfjs-dist';
import confetti from 'canvas-confetti';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function RotatePdf() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);
  const [rotations, setRotations] = useState({}); // mapping: pageIndex (0-based) -> degrees (0, 90, 180, 270)
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previews, setPreviews] = useState([]); // Array of canvas data URLs
  const [previewsLoading, setPreviewsLoading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setRotations({});
    setSelectedPages([]);
    setSuccessMessage('');
    setErrorMessage('');
    loadPreviews(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setRotations({});
    setSelectedPages([]);
    setPreviews([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Load small page previews in grid
  const loadPreviews = async (pdfFile) => {
    setPreviewsLoading(true);
    setPreviews([]);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      
      const newPreviews = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        
        // Render to virtual canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 0.3 }); // Small thumbnail
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        newPreviews.push(canvas.toDataURL());
      }
      setPreviews(newPreviews);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not render page previews.");
    } finally {
      setPreviewsLoading(false);
    }
  };

  const togglePageSelection = (idx) => {
    setSelectedPages(prev => 
      prev.includes(idx) ? prev.filter(p => p !== idx) : [...prev, idx]
    );
  };

  const selectAll = () => {
    const all = Array.from({ length: numPages }, (_, idx) => idx);
    setSelectedPages(all);
  };

  const selectNone = () => {
    setSelectedPages([]);
  };

  const applyRotation = (degChange) => {
    const targets = selectedPages.length > 0 
      ? selectedPages 
      : Array.from({ length: numPages }, (_, idx) => idx); // default rotate all if none selected

    const newRotations = { ...rotations };
    targets.forEach(idx => {
      const current = newRotations[idx] || 0;
      newRotations[idx] = (current + degChange) % 360;
      if (newRotations[idx] < 0) newRotations[idx] += 360;
    });
    setRotations(newRotations);
  };

  const handleSave = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'rotate');
      // Pass the first rotation angle or default to 90
      const rotationAngle = Object.values(rotations).find(r => r > 0) || 90;
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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-rotate.pdf`;
      
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

          const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Rotate PDF",
    "url": "https://wordtopdfconverter.online/rotate-pdf",
    "description": "A secure, fast, and free online tool to rotate your PDF files with 100% precision.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Perfect layout and formatting retention",
      "256-bit SSL encryption",
      "Automatic file deletion within 2 hours",
      "No registration required"
    ],
    "creator": {
      "@type": "Organization",
      "name": "WordToPDFConverter"
    }
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Secure Rotate PDF - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online Rotate PDF tool makes it effortless to rotate your documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Rotate PDF Online Without Losing Formatting</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Upload Document</h3>
            <p className="text-sm text-slate-500">Drag and drop your file into the secure upload area.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Secure Transfer</h3>
            <p className="text-sm text-slate-500">Files are transmitted over an encrypted 256-bit SSL connection.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. API Processing</h3>
            <p className="text-sm text-slate-500">Our engine executes the processing with pixel-perfect accuracy.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">4. Instant Download</h3>
            <p className="text-sm text-slate-500">Save the perfectly formatted file directly to your device.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Security & Privacy Guarantee</h2>
        <p className="text-slate-400">
          <strong>Enterprise-Grade Security:</strong> Trust is our priority. We employ strict, zero-retention data policies to protect your sensitive information. All file uploads and downloads are routed through 256-bit SSL/TLS encrypted channels, preventing interception. Once your processing is complete, our automated systems permanently wipe your files from our servers within a maximum of 2 hours. We do not read, analyze, or share your document contents with any third parties.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Will my converted file look exactly like the original?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Our Rotate PDF uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is it safe to process confidential documents online?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes, it is completely safe. All file transfers are secured with SSL encryption, and your documents are permanently deleted from our cloud servers within 2 hours.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Can I use this tool on my iPhone or Android?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Our web-based tool is fully responsive and cloud-powered, allowing you to seamlessly process documents on any mobile browser without downloading an app.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is there a file size limit for the free tool?</h3>
            <p className="text-slate-400 text-sm mt-1">No arbitrary limits are enforced for free usage. Our enterprise-grade cloud servers process even massive files in seconds.</p>
          </div>
        </div>
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
      title="Rotate PDF Pages"
      description="Rotate pages of your PDF document in 90-degree increments client-side."
      icon={RotateCw}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      onExecute={handleSave}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
    >
      {/* Visual Workspace Override */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Grid View (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Grid className="h-5 w-5 text-primary-500" />
              <h3 className="font-display font-bold text-lg text-white">Document Pages</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAll}
                disabled={isExecuting || previewsLoading}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Select All
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={selectNone}
                disabled={isExecuting || previewsLoading}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {previewsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary-500 space-y-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-xs text-slate-400">Loading page previews...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[480px] overflow-y-auto pr-2">
              {previews.map((src, idx) => {
                const isSelected = selectedPages.includes(idx);
                const rotation = rotations[idx] || 0;
                
                return (
                  <div
                    key={`preview-${idx}`}
                    onClick={() => togglePageSelection(idx)}
                    className={`relative cursor-pointer border rounded-xl overflow-hidden p-2 bg-slate-950/40 select-none group transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-500/5 shadow-lg' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Badge selection checkbox */}
                    <div className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-primary-500 border-primary-400 text-white' 
                        : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                    }`}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>

                    <div className="absolute top-3 right-3 z-10 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-400 border border-slate-800">
                      Page {idx + 1}
                    </div>

                    {/* Image rendering with CSS rotation */}
                    <div className="flex items-center justify-center p-4 min-h-[140px]">
                      <img 
                        src={src} 
                        alt={`Page ${idx + 1}`}
                        className="max-h-32 object-contain shadow rounded bg-white transition-transform duration-300"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      />
                    </div>

                    {rotation > 0 && (
                      <div className="absolute bottom-3 right-3 bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        {rotation}°
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Configuration Panel (4 Cols) */}
        <div className="lg:col-span-4 glass-card p-6 space-y-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-slate-800 pb-4">
            Rotation Settings
          </h3>

          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Apply Rotation
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => applyRotation(90)}
                disabled={isExecuting || previewsLoading}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all hover:scale-[1.02]"
              >
                <RotateCw className="h-5 w-5 mb-2 text-primary-500 animate-spin-slow" />
                <span className="text-xs font-semibold">Right 90°</span>
              </button>

              <button
                type="button"
                onClick={() => applyRotation(-90)}
                disabled={isExecuting || previewsLoading}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all hover:scale-[1.02]"
              >
                <RotateCcw className="h-5 w-5 mb-2 text-secondary-500" />
                <span className="text-xs font-semibold">Left 90°</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">This converter securely sends your file to the ILovePDF API for perfect processing. Your data is safely handled and the output is guaranteed to maintain precision.</p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm">
              {successMessage}
            </div>
          )}

          {isExecuting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-500" />
                  Generating rotated document...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-primary-600 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isExecuting || previewsLoading}
            className="w-full glass-button-primary"
          >
            {isExecuting ? 'Processing...' : 'Apply & Save PDF'}
          </button>
        </div>

      </div>
    </ToolLayout>
    </>
  );
}

export default RotatePdf;
