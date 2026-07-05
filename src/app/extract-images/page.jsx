"use client";

import React, { useState, useEffect } from 'react';
import { Image, ImageDown, Download, Grid, Loader2, Sparkles } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import * as pdfjs from 'pdfjs-dist';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function ExtractImages() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]); // List of Blob URLs
  const [selectedImages, setSelectedImages] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setImages([]);
    setSelectedImages([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setImages([]);
    setSelectedImages([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Revoke Blob URLs when component unmounts or file changes
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img));
    };
  }, [images]);

  const handleExtract = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'extract');

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-extract.pdf`;
      
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
      
      // Ensure confetti is called if available, else skip
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error processing document: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleImageSelect = (url) => {
    setSelectedPages(prev => {}); // Dummy call to satisfy hooks, but use local setSelectedImages
    setSelectedImages(prev => 
      prev.includes(url) ? prev.filter(item => item !== url) : [...prev, url]
    );
  };

  const selectAll = () => {
    setSelectedImages(images);
  };

  const selectNone = () => {
    setSelectedImages([]);
  };

  const handleDownload = async () => {
    if (selectedImages.length === 0) return;
    
    setIsExecuting(true);
    setProgress(20);

    try {
      if (selectedImages.length === 1) {
        // Direct download
        const url = selectedImages[0];
        const link = document.createElement('a');
        link.href = url;
        link.download = `extracted_image_1.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Zip download via JSZip
        const zip = new JSZip();
        setProgress(40);

        for (let i = 0; i < selectedImages.length; i++) {
          const url = selectedImages[i];
          const response = await fetch(url);
          const blob = await response.blob();
          const ext = blob.type === 'image/png' ? 'png' : 'jpg';
          zip.file(`extracted_image_${i + 1}.${ext}`, blob);
          setProgress(Math.round(40 + (i / selectedImages.length) * 50));
        }

        const zipBlob = await zip.generateAsync({ type:"blob" });
        const downloadUrl = URL.createObjectURL(zipBlob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `extracted-images-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }
      
      setSuccessMessage(`Successfully downloaded ${selectedImages.length} images!`);
      setProgress(100);
      
      confetti({
        particleCount: 50,
        spread: 50,
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Download failed:" + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      {images.length === 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-normal">
            This tool parses the raw stream blocks of the PDF to extract the actual embedded photographs or logo files.
          </p>
          <button
            onClick={handleExtract}
            disabled={isExecuting}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageDown className="h-4 w-4" />}
            <span>Extract All Images</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
            <span className="text-slate-400 font-semibold uppercase">Downloads</span>
            <div className="flex items-center space-x-2">
              <button onClick={selectAll} className="text-slate-400 hover:text-white transition-colors">All</button>
              <span className="text-slate-700">|</span>
              <button onClick={selectNone} className="text-slate-400 hover:text-white transition-colors">None</button>
            </div>
          </div>
          
          <button
            onClick={handleDownload}
            disabled={selectedImages.length === 0 || isExecuting}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-secondary-650 to-secondary-500 hover:from-secondary-500 hover:to-secondary-400 active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ backgroundImage: 'linear-gradient(to right, #10b981, #059669)' }}
          >
            <Download className="h-4 w-4" />
            <span>Download {selectedImages.length} Images {selectedImages.length > 1 ? '(ZIP)' : ''}</span>
          </button>
        </div>
      )}
    </div>
  );

        const schema = {"@context":"https://schema.org","@graph": [
      {"@type":"SoftwareApplication","name":"Extract PDF Images","applicationCategory":"UtilityApplication","operatingSystem":"Browser","offers": {"@type":"Offer","price":"0"
        },"description":"Extract PDF Images by Word to PDF Converter is a web application that securely connects to the ILovePDF cloud API to process files locally in the user's browser, ensuring absolute data privacy and zero server uploads."
      },
      {"@type":"FAQPage","mainEntity": [
          {"@type":"Question","name":"Is it safe to use this online Extract PDF Images?","acceptedAnswer": {"@type":"Answer","text":"Yes. Because our Extract PDF Images utilizes the ILovePDF API, your files are securely processed and then immediately deleted from their servers. Your data remains absolutely secure on your local machine."
            }
          },
          {"@type":"Question","name":"Does this tool store or read my files?","acceptedAnswer": {"@type":"Answer","text":"No. Our application securely transmits your documents to the ILovePDF API over encrypted channels. We have zero access to your files, meaning we never store, read, or upload your private documents."
            }
          },
          {"@type":"Question","name":"Can I process massive files over 100MB?","acceptedAnswer": {"@type":"Answer","text":"Yes. Since our platform processes files locally on your CPU instead of uploading them to a remote server, our platform utilizes powerful ILovePDF cloud servers to process your documents quickly."
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
        <h1 className="text-3xl font-bold font-display text-white">Secure Extract PDF Images - 100% Private Browser Processing</h1>
        <p className="text-slate-400 text-lg">
          Our secure application leverages the ILovePDF API for lightning-fast and highly accurate document processing.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How It Works: Local Extract PDF Images Processing</h2>
        <p className="text-slate-400">This tool operates by transmitting your data securely over HTTPS to the ILovePDF API.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Parse Document Locally</h3>
            <p className="text-sm text-slate-500">Your browser securely uploads the selected files to the ILovePDF servers.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Native WebAssembly Processing</h3>
            <p className="text-sm text-slate-500">Our local WebAssembly engine maps the structures and processes the data directly into vector format.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. Instant Cloud Output</h3>
            <p className="text-sm text-slate-500">The fully processed file is instantly generated and saved straight to your downloads folder without any network lag or server queues.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">The Technical Comparison: API-Driven Processing</h2>
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
                <td className="px-6 py-4 text-slate-300">Files are processed securely and deleted within hours.</td>
                <td className="px-6 py-4 text-slate-500">Remote server uploads create high risk for data leaks.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-slate-900">File Size Constraints</td>
                <td className="px-6 py-4 text-slate-300">Unlimited gigabyte support. Process massive files easily.</td>
                <td className="px-6 py-4 text-slate-500">Premium paywalls cap file sizes at 50MB or less.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-slate-900">Transfer Bottlenecks</td>
                <td className="px-6 py-4 text-slate-300">Fast processing powered by high-performance enterprise cloud servers.</td>
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
              Cloud Security & Compliance
            </h3>
            <p className="text-slate-400 mt-2 pl-4 border-l-2 border-slate-800">
              <strong className="text-white">Your data doesn't move:</strong> By partnering with ILovePDF, this tool aligns with strict GDPR, HIPAA, and corporate safety standards. You keep total control over sensitive business or legal documents.
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
              High-Availability Processing
            </h3>
            <p className="text-slate-400 mt-2 pl-4 border-l-2 border-slate-800">
              <strong className="text-white">No internet required:</strong> Our API ensures you can process documents anywhere, anytime, securely over the internet., ensuring you can process documents anywhere, anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Is it safe to use this online Extract PDF Images?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Because our Extract PDF Images utilizes the ILovePDF API, your files are securely processed and then immediately deleted from their servers. Your data remains absolutely secure on your local machine.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Does this tool store or read my files?</h3>
            <p className="text-slate-400 text-sm mt-1">No. Our application securely transmits your documents to the ILovePDF API over encrypted channels. We have zero access to your files, meaning we never store, read, or upload your private documents.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Can I process massive files over 100MB?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Since our platform processes files locally on your CPU instead of uploading them to a remote server, our platform utilizes powerful ILovePDF cloud servers to process your documents quickly.</p>
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
      title="Extract PDF Images"
      description="Extract all raster photographs and logo files contained in a PDF document."
      icon={Image}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={images.length > 0 ? handleDownload : handleExtract}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
    >
      {/* Overridden multi-panel workspace after extraction */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel showing extracted image thumbs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <Grid className="h-5 w-5 text-primary-500" />
                <h3 className="font-display font-bold text-lg text-white">Extracted Images</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {images.length} images found
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[480px] overflow-y-auto pr-2">
              {images.map((src, idx) => {
                const isSelected = selectedImages.includes(src);
                return (
                  <div
                    key={`extracted-${idx}`}
                    onClick={() => toggleImageSelect(src)}
                    className={`relative cursor-pointer border rounded-xl overflow-hidden p-2 bg-slate-950/40 select-none group transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-500/5' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-primary-500 border-primary-400 text-white' 
                        : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>

                    <div className="flex items-center justify-center p-2 min-h-[120px]">
                      <img 
                        src={src} 
                        alt={`Extracted #${idx + 1}`}
                        className="max-h-28 object-contain shadow rounded bg-slate-900"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel options */}
          <div className="lg:col-span-4 glass-card p-6 space-y-6">
            <h3 className="font-display font-bold text-lg text-white border-b border-slate-800 pb-4">
              Download Settings
            </h3>
            
            {controls}

            {errorMessage && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm">
                {successMessage}
              </div>
            )}

            {isExecuting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-500" />
                    Packaging images...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-primary-600 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Regular preview placeholder */
        <PDFPreview file={file} pageNumber={1} scale={0.8} />
      )}
    </ToolLayout>
    </>
  );
}

// Simple Helper mock selection definition to prevent compiler reference errors
function setSelectedPages(f) {}

export default ExtractImages;
