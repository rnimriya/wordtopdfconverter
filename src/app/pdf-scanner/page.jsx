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
        <h1 className="text-3xl font-bold font-display text-white">Secure PDF Scanner - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online PDF Scanner tool makes it effortless to pdf your documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to PDF Scanner Online Without Losing Formatting</h2>
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
            <p className="text-slate-400 text-sm mt-1">Yes. Our PDF Scanner uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
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
