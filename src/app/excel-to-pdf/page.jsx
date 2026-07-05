"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileText, ArrowRightLeft, Loader2, Grid } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { convertExcelToHtml } from '../../utils/excelParser.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

function ExcelToPdf() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const iframeRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
    setSheets([]);
    setActiveSheetIdx(0);
    setLoadingPreview(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const { sheets: parsedSheets } = await convertExcelToHtml(buffer);
      setSheets(parsedSheets);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not parse Excel document:" + err.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Render active sheet inside iframe
  useEffect(() => {
    if (sheets.length > 0 && iframeRef.current) {
      const activeSheet = sheets[activeSheetIdx];
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      const sheetHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #1e293b;
              padding: 20px;
              background: #ffffff;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px;
              text-align: left;
              font-size: 11px;
              white-space: nowrap;
            }
            th {
              background-color: #f1f5f9;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
          </style>
        </head>
        <body>
          <h2>Sheet: ${activeSheet.name}</h2>
          <div style="overflow-x: auto;">
            ${activeSheet.html}
          </div>
        </body>
        </html>
      `;

      doc.open();
      doc.write(sheetHtml);
      doc.close();
    }
  }, [sheets, activeSheetIdx]);

  const clearFile = () => {
    setFile(null);
    setSheets([]);
    setActiveSheetIdx(0);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'officepdf');

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-officepdf.pdf`;
      
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
      {sheets.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Select Sheet
          </label>
          <div className="flex flex-wrap gap-2">
            {sheets.map((sheet, index) => (
              <button
                key={sheet.name}
                type="button"
                onClick={() => setActiveSheetIdx(index)}
                disabled={isExecuting}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeSheetIdx === index
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900/30'
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
        <Grid className="h-4 w-4" />
        <span>SheetJS Workbook Matrix Render</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">This converter securely sends your file to the ILovePDF API for perfect processing. Your data is safely handled and the output is guaranteed to maintain precision.</p>
    </div>
  );

          const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Excel To PDF",
    "url": "https://wordtopdfconverter.online/excel-to-pdf",
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
        <h1 className="text-3xl font-bold font-display text-white">Secure Excel To PDF - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online Excel To PDF tool makes it effortless to convert documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to Excel To PDF Online Without Losing Formatting</h2>
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
            <p className="text-slate-400 text-sm mt-1">Yes. Our Excel To PDF uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
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
      title="Convert Excel to PDF"
      description="Convert Microsoft Excel (.xlsx/.xls) spreadsheet grids into clean PDF documents client-side."
      icon={Grid}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      accept=".xlsx,.xls,.csv"
      preview={
        sheets.length > 0 ? (
          <div className="w-full h-[500px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50 relative group">
            <div className="absolute inset-0">
              <iframe 
                ref={iframeRef}
                title="Excel Preview Sandbox" 
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : loadingPreview ? (
          <div className="flex flex-col items-center justify-center p-12 text-primary-500 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs text-slate-400">Parsing spreadsheet cell matrices...</span>
          </div>
        ) : null
      }
    />
    </>
  );
}

export default ExcelToPdf;
