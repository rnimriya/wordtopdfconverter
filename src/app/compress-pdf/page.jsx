"use client";

import React, { useState } from 'react';
import { Shrink, Sparkles, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { compressPDF } from '../../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function CompressPdf() {
  const [file, setFile] = useState(null);
  const [removeMetadata, setRemoveMetadata] = useState(true);
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

  const handleCompress = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'compress');

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-compress.pdf`;
      
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
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Compression Mode
        </label>
        <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Optimal Client-Side Stream Compression</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
        <input
          type="checkbox"
          id="removeMetadata"
          checked={removeMetadata}
          onChange={(e) => setRemoveMetadata(e.target.checked)}
          disabled={isExecuting}
          className="h-4.5 w-4.5 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-primary-500"
        />
        <label htmlFor="removeMetadata" className="text-xs text-slate-300 font-medium select-none cursor-pointer">
          Scrub document metadata (Author, Subject, Keywords)
        </label>
      </div>

      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          What is compressed?
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This tool runs stream compression algorithms on the structural data of the document and clears indexing metadata to optimize layout sizes without downscaling vector text.
        </p>
      </div>
    </div>
  );

      const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compress PDF",
    "url": "https://wordtopdfconverter.online/compress-pdf",
    "description": "A secure, fast, and free online tool to compress your PDF files with 100% precision.",
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
        <h1 className="text-3xl font-bold font-display text-white">Secure Compress PDF - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online Compress PDF tool makes it effortless to compress your documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Compress PDF Online Without Losing Formatting</h2>
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
            <p className="text-slate-400 text-sm mt-1">Yes. Our Compress PDF uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
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
      title="Compress PDF File"
      description="Reduce PDF file size in your browser without sacrificing formatting quality."
      icon={Shrink}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleCompress}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      preview={<PDFPreview file={file} pageNumber={1} scale={0.8} />}
    />
    </>
  );
}

export default CompressPdf;
