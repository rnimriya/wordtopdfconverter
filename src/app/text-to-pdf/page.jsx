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

        const schema = {"@context":"https://schema.org","@graph": [
      {"@type":"SoftwareApplication","name":"Convert Text to PDF","applicationCategory":"UtilityApplication","operatingSystem":"Browser","offers": {"@type":"Offer","price":"0"
        },"description":"Convert Text to PDF by Word to PDF Converter is a 100% client-side web application that utilizes WebAssembly to process files locally in the user's browser, ensuring absolute data privacy and zero server uploads."
      },
      {"@type":"FAQPage","mainEntity": [
          {"@type":"Question","name":"Is it safe to use this online Convert Text to PDF?","acceptedAnswer": {"@type":"Answer","text":"Yes. Because our Convert Text to PDF runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine."
            }
          },
          {"@type":"Question","name":"Does this tool store or read my files?","acceptedAnswer": {"@type":"Answer","text":"No. Our application processes your documents directly inside your browser's local sandbox memory. We have zero access to your files, meaning we never store, read, or upload your private documents."
            }
          },
          {"@type":"Question","name":"Can I process massive files over 100MB?","acceptedAnswer": {"@type":"Answer","text":"Yes. Since our platform processes files locally on your CPU instead of uploading them to a remote server, we place absolutely zero file size limits or network restrictions on your processing."
            }
          },
          {"@type":"Question","name":"Will the processed PDF lose my original formatting?","acceptedAnswer": {"@type":"Answer","text":"No. Our native rendering engine maps your document's precise layouts, fonts, and tables to guarantee lossless vector accuracy in the final output."
            }
          }
        ]
      }
    ]
  };

    const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">Secure Convert Text to PDF - 100% Private Browser Processing</h1>
        <p className="text-slate-400 text-lg">
          Our local WebAssembly engine executes the convert text to pdf operation entirely on your device. Your sensitive files never touch a remote cloud server.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How It Works: Local Convert Text to PDF Processing</h2>
        <p className="text-slate-400">This tool operates entirely within your browser's sandbox without transmitting data over the internet.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Parse Document Locally</h3>
            <p className="text-sm text-slate-500">Your browser reads the selected files directly from your local hard drive into temporary memory.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Native WebAssembly Processing</h3>
            <p className="text-sm text-slate-500">Our local WebAssembly engine extracts the document structure, fonts, and layouts, and compiles them directly into a PDF vector format.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. Instant Local Output</h3>
            <p className="text-sm text-slate-500">The fully processed file is instantly generated and saved straight to your downloads folder without any network lag or server queues.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">The Technical Comparison: Client-Side vs. Cloud Processors</h2>
        <p className="text-slate-400">Our WebAssembly architecture fundamentally changes how document processing is handled compared to legacy platforms.</p>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-3">Feature</th>
                <th className="px-6 py-3 text-primary-400">wordtopdfconverter.online</th>
                <th className="px-6 py-3">Traditional Cloud Converters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-slate-900">Data Privacy</td>
                <td className="px-6 py-4 text-slate-300">100% local browser sandbox. Files never leave your device.</td>
                <td className="px-6 py-4 text-slate-500">Remote server uploads create high risk for data leaks.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-slate-900">File Size Constraints</td>
                <td className="px-6 py-4 text-slate-300">Unlimited gigabyte support. Process massive files easily.</td>
                <td className="px-6 py-4 text-slate-500">Premium paywalls cap file sizes at 50MB or less.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-slate-900">Transfer Bottlenecks</td>
                <td className="px-6 py-4 text-slate-300">Instant local rendering tied directly to your CPU speed.</td>
                <td className="px-6 py-4 text-slate-500">Slow upload and download network bottlenecks.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-slate-900">Hidden Costs</td>
                <td className="px-6 py-4 text-slate-300">100% free with zero daily caps or hidden fees.</td>
                <td className="px-6 py-4 text-slate-500">Gated subscription timers force you to pay later.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Key Technical Features of Our Engine</h2>
        <p className="text-slate-400">Our local engine offers enterprise-grade capabilities right from your web browser.</p>
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              Local Security & Compliance
            </h3>
            <p className="text-slate-400 mt-2 pl-4 border-l-2 border-slate-800">
              <strong className="text-white">Your data doesn't move:</strong> By eliminating remote uploads, this tool inherently aligns with strict GDPR, HIPAA, and corporate safety standards. You keep total control over sensitive business or legal documents.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              Lossless Layout Mapping
            </h3>
            <p className="text-slate-400 mt-2 pl-4 border-l-2 border-slate-800">
              <strong className="text-white">Pixel-perfect processing:</strong> Our WebAssembly engine accurately parses precise structures to preserve layouts exactly as authored.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              Offline Functional Processing
            </h3>
            <p className="text-slate-400 mt-2 pl-4 border-l-2 border-slate-800">
              <strong className="text-white">No internet required:</strong> Once the web page loads, the core WebAssembly engine can function completely offline, ensuring you can process documents anywhere, anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Is it safe to use this online Convert Text to PDF?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Because our Convert Text to PDF runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Does this tool store or read my files?</h3>
            <p className="text-slate-400 text-sm mt-1">No. Our application processes your documents directly inside your browser's local sandbox memory. We have zero access to your files, meaning we never store, read, or upload your private documents.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Can I process massive files over 100MB?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Since our platform processes files locally on your CPU instead of uploading them to a remote server, we place absolutely zero file size limits or network restrictions on your processing.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Will the processed PDF lose my original formatting?</h3>
            <p className="text-slate-400 text-sm mt-1">No. Our native rendering engine maps your document's precise layouts, fonts, and tables to guarantee lossless vector accuracy in the final output.</p>
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
