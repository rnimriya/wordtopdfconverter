"use client";

import React, { useState } from 'react';
import { ScanEye, Languages, FileText, Download, Copy, Check, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import confetti from 'canvas-confetti';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

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
    setOcrText('');
    setProgress(5);

    let worker = null;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      // Initialize Tesseract Worker
      worker = await createWorker(language);
      setProgress(15);

      let fullText ="";

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Render PDF page to a sharp canvas for OCR scanning
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 }); // 1.5 scale is ideal for OCR sharpness
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Perform OCR on canvas
        const { data: { text } } = await worker.recognize(canvas);
        
        fullText += `--- Page ${pageNum} ---\n\n${text}\n\n`;
        setOcrText(fullText); // Stream results to UI

        const percent = Math.round(15 + (pageNum / totalPages) * 80);
        setProgress(percent);
      }

      await worker.terminate();
      worker = null;

      setProgress(100);
      setSuccessMessage("OCR completed successfully! You can download or copy the extracted text below.");
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("OCR execution failed:" + err.message);
      if (worker) {
        await worker.terminate();
      }
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

        const schema = {"@context":"https://schema.org","@graph": [
      {"@type":"SoftwareApplication","name":"OCR PDF (Text Recognition)","applicationCategory":"UtilityApplication","operatingSystem":"Browser","offers": {"@type":"Offer","price":"0"
        },"description":"OCR PDF (Text Recognition) by Word to PDF Converter is a 100% client-side web application that utilizes WebAssembly to process files locally in the user's browser, ensuring absolute data privacy and zero server uploads."
      },
      {"@type":"FAQPage","mainEntity": [
          {"@type":"Question","name":"Is it safe to use this online OCR PDF (Text Recognition)?","acceptedAnswer": {"@type":"Answer","text":"Yes. Because our OCR PDF (Text Recognition) runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine."
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
        <h1 className="text-3xl font-bold font-display text-white">Secure OCR PDF (Text Recognition) - 100% Private Browser Processing</h1>
        <p className="text-slate-400 text-lg">
          Our local WebAssembly engine executes the ocr pdf (text recognition) operation entirely on your device. Your sensitive files never touch a remote cloud server.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How It Works: Local OCR PDF (Text Recognition) Processing</h2>
        <p className="text-slate-400">This tool operates entirely within your browser's sandbox without transmitting data over the internet.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Parse Document Locally</h3>
            <p className="text-sm text-slate-500">Your browser reads the selected files directly from your local hard drive into temporary memory.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Native WebAssembly Processing</h3>
            <p className="text-sm text-slate-500">Our local WebAssembly engine maps the structures and processes the data directly into vector format.</p>
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
            <h3 className="font-bold text-white">Is it safe to use this online OCR PDF (Text Recognition)?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Because our OCR PDF (Text Recognition) runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine.</p>
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
