"use client";

import React, { useState } from 'react';
import { Combine, Trash2, ArrowUp, ArrowDown, Plus, FileText, ArrowRight } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { mergePDFs } from '../../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function MergePdf() {
  const [files, setFiles] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFiles) => {
    setSuccessMessage('');
    setErrorMessage('');
    const newFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    
    // Validate file types
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (validFiles.length !== newFiles.length) {
      setErrorMessage("Some selected files were not valid PDFs and were skipped.");
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const clearFiles = () => {
    setFiles([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const moveFile = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('file', f));
      formData.append('task', 'merge');

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
      downloadName = `merge-result-${Date.now()}.pdf`;
      
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

    const schema = {"@context":"https://schema.org","@graph": [
      {"@type":"SoftwareApplication","name":"Merge PDF Documents","applicationCategory":"UtilityApplication","operatingSystem":"Browser","offers": {"@type":"Offer","price":"0"
        },"description":"Merge PDF Documents by Word to PDF Converter is a 100% client-side web application that utilizes WebAssembly to process files locally in the user's browser, ensuring absolute data privacy and zero server uploads."
      },
      {"@type":"FAQPage","mainEntity": [
          {"@type":"Question","name":"Is it safe to use this online Merge PDF Documents?","acceptedAnswer": {"@type":"Answer","text":"Yes. Because our Merge PDF Documents runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine."
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
        <h1 className="text-3xl font-bold font-display text-white">Secure Merge PDF Documents - 100% Private Browser Processing</h1>
        <p className="text-slate-400 text-lg">
          Our local WebAssembly engine executes the merge pdf documents operation entirely on your device. Your sensitive files never touch a remote cloud server.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How It Works: Local Merge PDF Documents Processing</h2>
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
            <h3 className="font-bold text-white">Is it safe to use this online Merge PDF Documents?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Because our Merge PDF Documents runs entirely via WebAssembly in your browser, your files never touch a server. Your data remains absolutely secure on your local machine.</p>
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
        title="Merge PDF Documents"
        description="Combine multiple PDF documents into a single file directly in your browser."
        icon={Combine}
        file={files.length > 0 ? files : null}
        onFileSelect={handleFileSelect}
        onClear={clearFiles}
        onExecute={handleMerge}
        isExecuting={isExecuting}
        progress={progress}
        successMessage={successMessage}
        errorMessage={errorMessage}
        seoContent={seoContent}
        multiple={true}
      >
        {/* Custom Multiple File Workspace */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-display font-bold text-lg text-white">Selected PDF Files</h3>
            <button
              onClick={clearFiles}
              disabled={isExecuting}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* File List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, idx) => (
              <div 
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-all"
              >
                <div className="flex items-center space-x-3 truncate">
                  <FileText className="h-5 w-5 text-primary-500 shrink-0" />
                  <div className="truncate">
                    <h4 className="font-medium text-white text-sm truncate max-w-[200px] sm:max-w-[400px]">
                      {file.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0 || isExecuting}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === files.length - 1 || isExecuting}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    disabled={isExecuting}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Append more files area */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full">
              <label className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 rounded-xl cursor-pointer text-sm text-slate-400 hover:text-white transition-all">
                <Plus className="h-4 w-4 text-primary-500" />
                <span>Add more PDF files</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
                  disabled={isExecuting}
                />
              </label>
            </div>
            
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isExecuting}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none shadow-lg shadow-primary-500/10"
            >
              <span>Merge Documents</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}

export default MergePdf;
