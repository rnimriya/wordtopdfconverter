"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Presentation, ArrowRightLeft, Loader2, Play } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

function PptToPdf() {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
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
    setSlides([]);
    setActiveSlideIdx(0);
    setLoadingPreview(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      
      // Filter slide XML files
      const slideFiles = [];
      zip.forEach((path, zipEntry) => {
        if (path.startsWith('ppt/slides/slide') && path.endsWith('.xml')) {
          slideFiles.push(zipEntry);
        }
      });

      // Sort files numerically by slide index
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0]);
        const numB = parseInt(b.name.match(/\d+/)[0]);
        return numA - numB;
      });

      if (slideFiles.length === 0) {
        throw new Error("No presentation slides identified inside PPTX file structure.");
      }

      const parsedSlides = [];
      const parser = new DOMParser();

      for (const entry of slideFiles) {
        const xmlText = await entry.async("text");
        const xmlDoc = parser.parseFromString(xmlText,"text/xml");
        
        // Find all text elements <a:t>
        const textElements = xmlDoc.getElementsByTagName("a:t");
        const slideTextItems = [];
        
        for (let i = 0; i < textElements.length; i++) {
          slideTextItems.push(textElements[i].textContent);
        }

        parsedSlides.push({
          name: `Slide ${parsedSlides.length + 1}`,
          text: slideTextItems.join(' ').trim() ||"No text content identified on slide."
        });
      }

      setSlides(parsedSlides);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not parse PPTX presentation:" + err.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Render active slide inside iframe
  useEffect(() => {
    if (slides.length > 0 && iframeRef.current) {
      const activeSlide = slides[activeSlideIdx];
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      const slideHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #334155;
              padding: 40px;
              background: #f8fafc;
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              box-sizing: border-box;
            }
            .slide-card {
              border: 1px solid #e2e8f0;
              background: #ffffff;
              border-radius: 12px;
              padding: 30px;
              height: calc(100vh - 80px);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              box-sizing: border-box;
            }
            h1 {
              font-size: 24pt;
              font-weight: bold;
              color: #4f46e5;
              margin-top: 0;
              margin-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
            }
            p {
              font-size: 14pt;
              line-height: 1.6;
              margin-bottom: 0;
              text-align: left;
              flex-grow: 1;
            }
            .footer {
              font-size: 10pt;
              color: #94a3b8;
              text-align: right;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="slide-card">
            <h1>${activeSlide.name}</h1>
            <p>${activeSlide.text}</p>
            <div class="footer">${activeSlide.name} of ${slides.length}</div>
          </div>
        </body>
        </html>
      `;

      doc.open();
      doc.write(slideHtml);
      doc.close();
    }
  }, [slides, activeSlideIdx]);

  const clearFile = () => {
    setFile(null);
    setSlides([]);
    setActiveSlideIdx(0);
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
      {slides.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Select Slide
          </label>
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
            {slides.map((slide, index) => (
              <button
                key={slide.name}
                type="button"
                onClick={() => setActiveSlideIdx(index)}
                disabled={isExecuting}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeSlideIdx === index
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900/30'
                }`}
              >
                {slide.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
        <Presentation className="h-4 w-4" />
        <span>Landscape slide layout extraction</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">This converter securely sends your file to the ILovePDF API for perfect processing. Your data is safely handled and the output is guaranteed to maintain precision.</p>
    </div>
  );

            const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PPT To PDF",
    "url": "https://wordtopdfconverter.online/ppt-to-pdf",
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
        <h1 className="text-3xl font-bold font-display text-white">PPT To PDF Quickly and Securely</h1>
        <p className="text-slate-400 text-lg">
          Need to convert without losing your original formatting? Our tool makes it incredibly easy to turn your documents into polished, professional files in just a few seconds. Whether you are finalizing a business contract, submitting a school assignment, or preparing a presentation, you can count on us to make sure your document looks exactly the way you intended on any device. Best of all, you can use our tool to convert online completely free of charge.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to PPT To PDF Online</h2>
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
          We know how important your privacy is. When you use our free PPT To PDF tool, you can rest easy knowing we have strict security measures in place. Every file you upload and download is encrypted, meaning no one can intercept your data. To keep your information totally private, our system automatically and permanently deletes your files from our servers within two hours of your conversion. We never read, analyze, or share your documents with anyone.
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
      title="Convert PPT to PDF"
      description="Convert Microsoft PowerPoint (.pptx) deck slide files into PDF documents client-side."
      icon={Presentation}
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
      accept=".pptx"
      preview={
        slides.length > 0 ? (
          <div className="w-full h-[500px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50 relative group">
            <div className="absolute inset-0">
              <iframe 
                ref={iframeRef}
                title="PPT Preview Sandbox" 
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : loadingPreview ? (
          <div className="flex flex-col items-center justify-center p-12 text-primary-500 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs text-slate-400">Parsing slide vector XML files...</span>
          </div>
        ) : null
      }
    />
    </>
  );
}

export default PptToPdf;
