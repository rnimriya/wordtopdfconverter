"use client";

import React, { useState } from 'react';
import { Combine, Trash2, ArrowUp, ArrowDown, Plus, FileText, ArrowRight } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { mergePDFs } from '../../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function MergePdf() {
  const [files, setFiles] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFiles) => {
    setSuccessMessage('');
    setErrorMessage('');
    const newFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    
    // Validate file types
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (validFiles.length !== newFiles.length) {
      setErrorMessage("Some selected files were not valid PDFs and were skipped.");
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const clearFiles = () => {
    setFiles([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const moveFile = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('file', f));
      formData.append('task', 'merge');

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
      downloadName = `merge-result-${Date.now()}.pdf`;
      
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
    "name": "Merge PDF",
    "url": "https://wordtopdfconverter.online/merge-pdf",
    "description": "A secure, fast, and free online tool to merge your PDF files with 100% precision.",
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
        <h1 className="text-3xl font-bold font-display text-white">Merge PDF Quickly and Securely</h1>
        <p className="text-slate-400 text-lg">
          Need to merge your without losing your original formatting? Our tool makes it incredibly easy to turn your documents into polished, professional files in just a few seconds. Whether you are finalizing a business contract, submitting a school assignment, or preparing a presentation, you can count on us to make sure your document looks exactly the way you intended on any device. Best of all, you can use our tool to merge your online completely free of charge.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Merge PDF Online</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Upload Document</h3>
            <p className="text-sm text-slate-500">Simply drag and drop your file right into our secure upload box.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Secure Transfer</h3>
            <p className="text-sm text-slate-500">Your file is instantly protected by a secure 256-bit SSL connection.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. Fast Processing</h3>
            <p className="text-sm text-slate-500">Our system quickly processes your file while keeping your layout perfectly intact.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">4. Instant Download</h3>
            <p className="text-sm text-slate-500">Save your new, cleanly formatted file directly to your device and you are good to go!</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Your Privacy and Security Come First</h2>
        <p className="text-slate-400">
          We know how important your privacy is. When you use our free Merge PDF tool, you can rest easy knowing we have strict security measures in place. Every file you upload and download is encrypted, meaning no one can intercept your data. To keep your information totally private, our system automatically and permanently deletes your files from our servers within two hours of your processing. We never read, analyze, or share your documents with anyone.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Will my output look exactly like my original document?</h3>
            <p className="text-slate-400 text-sm mt-1">Absolutely. We use advanced formatting technology to make sure your fonts, images, margins, and tables look perfect and remain exactly where you put them.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is it safe to upload confidential documents?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes, it is completely safe. We use strong SSL encryption for all file transfers, and we permanently wipe your files from our secure servers within two hours.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Can I process files on my phone?</h3>
            <p className="text-slate-400 text-sm mt-1">You sure can! Our website is fully optimized for mobile devices, so you can easily merge your online using your iPhone or Android browser—no extra apps required.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Are there file size limits for the free tool?</h3>
            <p className="text-slate-400 text-sm mt-1">We do not put strict limits on file sizes for everyday use. Our powerful cloud servers are designed to handle even large documents quickly and efficiently.</p>
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
        title="Merge PDF Documents"
        description="Combine multiple PDF documents into a single file directly in your browser."
        icon={Combine}
        file={files.length > 0 ? files : null}
        onFileSelect={handleFileSelect}
        onClear={clearFiles}
        onExecute={handleMerge}
        isExecuting={isExecuting}
        progress={progress}
        successMessage={successMessage}
        errorMessage={errorMessage}
        seoContent={seoContent}
        multiple={true}
      >
        {/* Custom Multiple File Workspace */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-display font-bold text-lg text-white">Selected PDF Files</h3>
            <button
              onClick={clearFiles}
              disabled={isExecuting}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* File List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, idx) => (
              <div 
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-all"
              >
                <div className="flex items-center space-x-3 truncate">
                  <FileText className="h-5 w-5 text-primary-500 shrink-0" />
                  <div className="truncate">
                    <h4 className="font-medium text-white text-sm truncate max-w-[200px] sm:max-w-[400px]">
                      {file.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0 || isExecuting}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === files.length - 1 || isExecuting}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    disabled={isExecuting}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Append more files area */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full">
              <label className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 rounded-xl cursor-pointer text-sm text-slate-400 hover:text-white transition-all">
                <Plus className="h-4 w-4 text-primary-500" />
                <span>Add more PDF files</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
                  disabled={isExecuting}
                />
              </label>
            </div>
            
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isExecuting}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none shadow-lg shadow-primary-500/10"
            >
              <span>Merge Documents</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}

export default MergePdf;
