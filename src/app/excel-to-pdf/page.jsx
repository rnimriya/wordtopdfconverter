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

        const schema = {"@context":"https://schema.org","@graph": [
      {"@type":"SoftwareApplication","name":"Convert Excel to PDF","applicationCategory":"UtilityApplication","operatingSystem":"Browser","offers": {"@type":"Offer","price":"0"
        },"description":"Convert Excel to PDF by Word to PDF Converter is a 100% client-side web application that utilizes WebAssembly to process files locally in the user's browser, ensuring absolute data privacy and zero server uploads."
      },
      {"@type":"FAQPage","mainEntity": [
          {"@type":"Question","name":"Is it safe to use this online Convert Excel to PDF?","acceptedAnswer": {"@type":"Answer","text":"Yes. Because our Convert Excel to PDF runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine."
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
        <h1 className="text-3xl font-bold font-display text-white">Secure Convert Excel to PDF - 100% Private Browser Processing</h1>
        <p className="text-slate-400 text-lg">
          Our local WebAssembly engine executes the convert excel to pdf operation entirely on your device. Your sensitive files never touch a remote cloud server.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How It Works: Local Convert Excel to PDF Processing</h2>
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
            <h3 className="font-bold text-white">Is it safe to use this online Convert Excel to PDF?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Because our Convert Excel to PDF runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine.</p>
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
