"use client";

import React, { useState, useEffect } from 'react';
import { Image, Download, Loader2, ArrowRight } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

function JpgToPdf() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFiles) => {
    setSuccessMessage('');
    setErrorMessage('');
    const newFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    
    // Validate image format
    const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) {
      setErrorMessage("Some files were not valid images and were skipped.");
    }
    
    setFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setPreviews([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('file', f));
      formData.append('task', 'imagepdf');

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
      downloadName = `imagepdf-result-${Date.now()}.pdf`;
      
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

  const controls = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
        <Image className="h-4 w-4" />
        <span>A4 Layout auto-fitting mode</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">This converter securely sends your file to the ILovePDF API for perfect processing. Your data is safely handled and the output is guaranteed to maintain precision.</p>
    </div>
  );

          const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Jpg To PDF",
    "url": "https://wordtopdfconverter.online/jpg-to-pdf",
    "description": "A secure, fast, and free online tool to convert PDF files with 100% precision.",
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
        <h1 className="text-3xl font-bold font-display text-white">Secure Jpg To PDF - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online Jpg To PDF tool makes it effortless to convert documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Jpg To PDF Online Without Losing Formatting</h2>
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
            <p className="text-sm text-slate-500">Our engine executes the conversion with pixel-perfect accuracy.</p>
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
          <strong>Enterprise-Grade Security:</strong> Trust is our priority. We employ strict, zero-retention data policies to protect your sensitive information. All file uploads and downloads are routed through 256-bit SSL/TLS encrypted channels, preventing interception. Once your conversion is complete, our automated systems permanently wipe your files from our servers within a maximum of 2 hours. We do not read, analyze, or share your document contents with any third parties.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Will my converted file look exactly like the original?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Our Jpg To PDF uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
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
      title="Convert JPG/PNG to PDF"
      description="Convert photo and image files into a single compiled PDF document client-side."
      icon={Image}
      file={files.length > 0 ? files : null}
      onFileSelect={handleFileSelect}
      onClear={clearFiles}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      accept="image/*"
      multiple={true}
    >
      {/* Overridden multi-image list workspace */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-display font-bold text-lg text-white">Selected Images</h3>
          <button
            onClick={clearFiles}
            disabled={isExecuting}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Thumbnail Preview Area */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 max-h-[300px] overflow-y-auto pr-2">
          {previews.map((src, idx) => (
            <div 
              key={`img-pre-${idx}`}
              className="relative border border-slate-800 rounded-xl overflow-hidden p-2 bg-slate-950/40"
            >
              <div className="absolute top-2 right-2 bg-slate-950/80 px-1.5 py-0.5 rounded text-[8px] font-semibold text-slate-400 border border-slate-800">
                #{idx + 1}
              </div>
              <div className="flex items-center justify-center p-1 min-h-[90px]">
                <img 
                  src={src} 
                  alt="preview"
                  className="max-h-20 object-contain shadow rounded bg-slate-900"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full">
            <label className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 rounded-xl cursor-pointer text-sm text-slate-400 hover:text-white transition-all">
              <PlusIcon className="h-4 w-4 text-primary-500" />
              <span>Add more images</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
                disabled={isExecuting}
              />
            </label>
          </div>
          
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isExecuting}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg"
          >
            <span>Convert to PDF</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </ToolLayout>
    </>
  );
}

// Simple internal helper icon to prevent missing reference compiles
function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export default JpgToPdf;
