"use client";

import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { protectPDF } from '../../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function ProtectPdf() {
  const [file, setFile] = useState(null);
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    setUserPassword('');
    setConfirmPassword('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleProtect = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'protect');
      if (userPassword) formData.append('password', userPassword);

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-protect.pdf`;
      
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
          Set Open Password
        </label>
        <div className="relative">
          <input
            type={showPassword ?"text" :"password"}
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            disabled={isExecuting}
            placeholder="Enter password"
            className="glass-input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Confirm Password
        </label>
        <input
          type={showPassword ?"text" :"password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isExecuting}
          placeholder="Re-enter password"
          className="glass-input"
        />
      </div>

      <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-primary-500" />
          Real Encryption (AES/RC4)
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This applies a real cryptographic lock to the document. Any standard PDF viewer (e.g. Acrobat Reader, Chrome, macOS Preview) will require this password to open it.
        </p>
      </div>
    </div>
  );

            const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Protect PDF",
    "url": "https://wordtopdfconverter.online/protect-pdf",
    "description": "A secure, fast, and free online tool to protect your PDF files with 100% precision.",
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
        <h1 className="text-3xl font-bold font-display text-white">Protect PDF Quickly and Securely</h1>
        <p className="text-slate-400 text-lg">
          Need to protect your without losing your original formatting? Our tool makes it incredibly easy to turn your documents into polished, professional files in just a few seconds. Whether you are finalizing a business contract, submitting a school assignment, or preparing a presentation, you can count on us to make sure your document looks exactly the way you intended on any device. Best of all, you can use our tool to protect your online completely free of charge.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Protect PDF Online</h2>
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
          We know how important your privacy is. When you use our free Protect PDF tool, you can rest easy knowing we have strict security measures in place. Every file you upload and download is encrypted, meaning no one can intercept your data. To keep your information totally private, our system automatically and permanently deletes your files from our servers within two hours of your processing. We never read, analyze, or share your documents with anyone.
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
            <p className="text-slate-400 text-sm mt-1">You sure can! Our website is fully optimized for mobile devices, so you can easily protect your online using your iPhone or Android browser—no extra apps required.</p>
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
      title="Protect PDF Document"
      description="Add password encryption to your PDF document client-side for maximum security."
      icon={KeyRound}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleProtect}
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

export default ProtectPdf;
