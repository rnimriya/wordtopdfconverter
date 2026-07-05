"use client";

import React, { useState } from 'react';
import { ScanEye, Languages, FileText, Download, Copy, Check, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import confetti from 'canvas-confetti';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function OcrPdf() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setOcrText('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setOcrText('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleOCR = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'pdfocr');

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-pdfocr.pdf`;
      
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
      
      // Ensure confetti is called if available, else skip
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

  const handleCopy = () => {
    if (!ocrText) return;
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!ocrText) return;
    const blob = new Blob([ocrText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.replace('.pdf', '')}-text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Document Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isExecuting}
          className="glass-input select-arrow"
        >
          <option value="eng">English (ENG)</option>
          <option value="spa">Spanish (SPA)</option>
          <option value="fra">French (FRA)</option>
          <option value="deu">German (GER)</option>
          <option value="chi_sim">Chinese Simplified (CHI)</option>
          <option value="ara">Arabic (ARA)</option>
          <option value="hin">Hindi (HIN)</option>
        </select>
      </div>

      {ocrText && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 text-xs text-slate-300 hover:text-white transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-primary-500" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 text-xs text-slate-300 hover:text-white transition-all"
          >
            <Download className="h-4 w-4 text-secondary-500" />
            <span>Download .txt</span>
          </button>
        </div>
      )}
    </div>
  );

          const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OCR PDF",
    "url": "https://wordtopdfconverter.online/ocr-pdf",
    "description": "A secure, fast, and free online tool to ocr your PDF files with 100% precision.",
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
        <h1 className="text-3xl font-bold font-display text-white">Secure OCR PDF - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online OCR PDF tool makes it effortless to ocr your documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to OCR PDF Online Without Losing Formatting</h2>
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
            <p className="text-slate-400 text-sm mt-1">Yes. Our OCR PDF uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
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
      title="OCR PDF (Text Recognition)"
      description="Scan PDF images and convert them to copyable text files entirely client-side."
      icon={ScanEye}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={ocrText ? handleDownload : handleOCR}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
    >
      {/* Overridden split panel displaying live OCR text */}
      {ocrText ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel showing source PDF page 1 */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <h4 className="font-display font-semibold text-sm text-slate-400 border-b border-slate-800 pb-2">
              Source PDF Preview
            </h4>
            <PDFPreview file={file} pageNumber={1} scale={0.7} />
          </div>

          {/* Right panel showing extracted text streams */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-display font-semibold text-sm text-slate-400">
                Extracted Text Output
              </h4>
              {isExecuting && (
                <div className="flex items-center space-x-1.5 text-xs text-primary-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Scanning...</span>
                </div>
              )}
            </div>
            
            <textarea
              readOnly
              value={ocrText}
              placeholder="OCR text will render here during processing..."
              className="w-full h-[320px] p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"
            />
          </div>

        </div>
      ) : (
        <PDFPreview file={file} pageNumber={1} scale={0.8} />
      )}
    </ToolLayout>
    </>
  );
}

export default OcrPdf;
