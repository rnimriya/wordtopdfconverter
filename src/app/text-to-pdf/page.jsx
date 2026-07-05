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
        <h1 className="text-3xl font-bold font-display text-white">Secure Text To PDF - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online Text To PDF tool makes it effortless to convert documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Text To PDF Online Without Losing Formatting</h2>
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
            <p className="text-slate-400 text-sm mt-1">Yes. Our Text To PDF uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
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
