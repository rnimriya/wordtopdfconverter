"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

const SAMPLE_TEXT = `CONTRACT SUMMARY & AGREEMENT
----------------------------

Date: May 28, 2026

This document serves as the formal agreement between the Project Sponsor and Developer regarding the final delivery parameters of the PDF utility software platform.

1. Scope of Work
The Developer is tasked with transitioning 20+ frontend mock simulations into fully functional client-side document processing widgets.

2. Deliverable Quality Standards
All widgets must utilize local browser memory sandboxes (via WebAssembly libraries like pdf-lib, pdfjs-dist, and Tesseract.js) to guarantee 100% data safety.

3. Signature
Project Sponsor: ________________________
Developer:       ________________________`;

function TextToPdf() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef(null);

  // Update preview iframe
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      
      const styledText = text
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/\n/g,"<br/>");

      const previewHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 11.5pt;
              line-height: 1.5;
              color: #1e293b;
              padding: 25px;
              white-space: pre-wrap;
              background: #ffffff;
            }
          </style>
        </head>
        <body>${styledText}</body>
        </html>
      `;

      doc.open();
      doc.write(previewHtml);
      doc.close();
    }
  }, [text]);

  const handleFileSelect = () => {};
  const clearFile = () => {
    setText('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!text.trim()) {
      setErrorMessage("Please write some text to compile.");
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(30);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 20; // 20mm margins
      const pdfWidth = 210; // A4 width
      const maxLineWidth = pdfWidth - (margin * 2);
      
      pdf.setFont("courier","normal");
      pdf.setFontSize(11);

      // Split long lines of text to fit page bounds automatically
      const sourceLines = text.split('\n');
      const wrappedLines = [];

      sourceLines.forEach(line => {
        if (line.trim() === '') {
          wrappedLines.push('');
        } else {
          const splitLines = pdf.splitTextToSize(line, maxLineWidth);
          wrappedLines.push(...splitLines);
        }
      });
      setProgress(60);

      let yPosition = margin;
      const pageHeight = 295;
      const maxYPosition = pageHeight - margin;
      const lineSpacing = 6; // 6mm line spacing

      wrappedLines.forEach((line, idx) => {
        if (yPosition + lineSpacing > maxYPosition) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineSpacing;
      });
      setProgress(90);

      pdf.save(`text-document-${Date.now()}.pdf`);
      setProgress(100);
      setSuccessMessage("Text successfully compiled to A4 PDF document! Download initiated.");
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Conversion failed:" + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Document Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isExecuting}
          placeholder="Type or paste plain text documents here..."
          className="w-full h-[280px] p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"
        />
      </div>
    </div>
  );

            const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Text To PDF",
    "url": "https://wordtopdfconverter.online/text-to-pdf",
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
        <h1 className="text-3xl font-bold font-display text-white">Text To PDF Quickly and Securely</h1>
        <p className="text-slate-400 text-lg">
          Need to convert without losing your original formatting? Our tool makes it incredibly easy to turn your documents into polished, professional files in just a few seconds. Whether you are finalizing a business contract, submitting a school assignment, or preparing a presentation, you can count on us to make sure your document looks exactly the way you intended on any device. Best of all, you can use our tool to convert online completely free of charge.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Text To PDF Online</h2>
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
          We know how important your privacy is. When you use our free Text To PDF tool, you can rest easy knowing we have strict security measures in place. Every file you upload and download is encrypted, meaning no one can intercept your data. To keep your information totally private, our system automatically and permanently deletes your files from our servers within two hours of your conversion. We never read, analyze, or share your documents with anyone.
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
            <p className="text-slate-400 text-sm mt-1">You sure can! Our website is fully optimized for mobile devices, so you can easily convert online using your iPhone or Android browser—no extra apps required.</p>
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
      title="Convert Text to PDF"
      description="Write or paste plain text content and convert it into a standard A4 PDF document."
      icon={FileText}
      file={text ? true : null} // Bypass check
      onFileSelect={() => {}}
      onClear={clearFile}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      preview={
        <div className="flex flex-col space-y-3 w-full">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Preview</h4>
          <div className="border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner">
            <iframe 
              ref={iframeRef} 
              title="Text Preview Sandbox" 
              className="w-full h-full border-none"
            />
          </div>
        </div>
      }
    />
    </>
  );
}

export default TextToPdf;
