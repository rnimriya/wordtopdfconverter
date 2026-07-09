"use client";

import React, { useState } from 'react';
import { Printer, Camera } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';

function PdfScanner() {
  const [image, setImage] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCompile = async () => {
    if (!image) return;
    setIsExecuting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.addImage(image, 'JPEG', 10, 10, 190, 277);
      doc.save('scan-output.pdf');
      setSuccess("Scan successfully compiled to PDF!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <label className="flex items-center justify-center space-x-2 w-full p-4 border border-dashed rounded-xl cursor-pointer text-xs bg-slate-50 text-slate-700">
        <Camera className="h-4 w-4" />
        <span>Capture from Camera</span>
        <input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
      </label>
      <button onClick={handleCompile} className="w-full glass-button-primary text-xs" disabled={!image}>Compile to PDF</button>
    </div>
  );

          const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Scanner",
    "url": "https://wordtopdfconverter.online/pdf-scanner",
    "description": "A secure, fast, and free online tool to pdf your PDF files with 100% precision.",
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
        <h1 className="text-3xl font-bold font-display text-white">PDF Scanner Quickly and Securely</h1>
        <p className="text-slate-400 text-lg">
          Need to pdf your without losing your original formatting? Our tool makes it incredibly easy to turn your documents into polished, professional files in just a few seconds. Whether you are finalizing a business contract, submitting a school assignment, or preparing a presentation, you can count on us to make sure your document looks exactly the way you intended on any device. Best of all, you can use our tool to pdf your online completely free of charge.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to PDF Scanner Online</h2>
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
          We know how important your privacy is. When you use our free PDF Scanner tool, you can rest easy knowing we have strict security measures in place. Every file you upload and download is encrypted, meaning no one can intercept your data. To keep your information totally private, our system automatically and permanently deletes your files from our servers within two hours of your processing. We never read, analyze, or share your documents with anyone.
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
            <p className="text-slate-400 text-sm mt-1">You sure can! Our website is fully optimized for mobile devices, so you can easily pdf your online using your iPhone or Android browser—no extra apps required.</p>
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
      seoContent={seoContent}
      title="PDF Scanner"
      description="Scan documents using your device webcam or camera."
      icon={Printer}
      file={image ? new File([], 'captured.jpg') : null}
      onFileSelect={() => {}}
      onClear={() => { setImage(null); setSuccess(''); }}
      controls={controls}
      onExecute={handleCompile}
      isExecuting={isExecuting}
      successMessage={success}
      preview={image && <div className="p-4 border rounded-xl bg-slate-50"><img src={image} className="max-h-60 mx-auto" /></div>}
    />
    </>
  );
}

export default PdfScanner;
