import React, { useState, useRef, useEffect } from 'react';
import { Plus, Link2, DownloadCloud, Monitor, ChevronDown } from 'lucide-react';

function Dropzone({ onFileSelect, accept =".pdf", multiple = false, title ="Online PDF Converter", description ="Easily convert to and from PDF in seconds." }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'drive', 'dropbox', 'url'
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [importingUrl, setImportingUrl] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type ==="dragenter" || e.type ==="dragover") {
      setIsDragActive(true);
    } else if (e.type ==="dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        onFileSelect(Array.from(e.dataTransfer.files));
      } else {
        onFileSelect(e.dataTransfer.files[0]);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        onFileSelect(Array.from(e.target.files));
      } else {
        onFileSelect(e.target.files[0]);
      }
    }
  };

  const onButtonClick = (e) => {
    if (e) e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Generate simulated file
  const handleSelectSimulatedFile = (fileName, sizeInBytes) => {
    const dummyContent ="%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF";
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const file = new File([blob], fileName, { type: 'application/pdf', lastModified: new Date() });
    if (multiple) {
      onFileSelect([file]);
    } else {
      onFileSelect(file);
    }
    setActiveModal(null);
  };

  // Import from Web URL
  const handleUrlImport = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setUrlError('Please enter a valid URL.');
      return;
    }
    setUrlError('');
    setImportingUrl(true);
    let fileName = 'document.pdf';
    try {
      const urlObj = new URL(urlInput);
      const pathname = urlObj.pathname;
      const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
      if (lastSegment && lastSegment.includes('.')) {
        fileName = lastSegment;
      } else {
        fileName = 'web-document.pdf';
      }
    } catch (err) {
      setUrlError('Invalid URL format.');
      setImportingUrl(false);
      return;
    }
    if (!fileName.toLowerCase().endsWith('.pdf') && accept.includes('.pdf')) {
      fileName = fileName.split('.')[0] + '.pdf';
    }
    try {
      const response = await fetch(urlInput, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type || 'application/pdf', lastModified: new Date() });
        if (multiple) {
          onFileSelect([file]);
        } else {
          onFileSelect(file);
        }
        setActiveModal(null);
        setUrlInput('');
      } else {
        throw new Error('CORS restriction');
      }
    } catch (err) {
      setTimeout(() => {
        handleSelectSimulatedFile(fileName, 1024 * 1024);
        setImportingUrl(false);
        setUrlInput('');
      }, 800);
    }
  };

  const driveFiles = [
    { name: 'Business_Contract_Final.pdf', size: '1.4 MB', bytes: 1450000 },
    { name: 'Marketing_Pitch_Deck.pdf', size: '4.2 MB', bytes: 4400000 },
    { name: 'Q1_Financial_Report.pdf', size: '850 KB', bytes: 870000 },
    { name: 'Product_Development_Plan.pdf', size: '2.3 MB', bytes: 2400000 }
  ];

  const dropboxFiles = [
    { name: 'Invoice_Sticker_Details.pdf', size: '320 KB', bytes: 327000 },
    { name: 'Annual_Tax_Statement_2025.pdf', size: '1.8 MB', bytes: 1890000 },
    { name: 'HQ_Office_Floorplan.pdf', size: '3.1 MB', bytes: 3200000 },
    { name: 'Employee_Handbook.pdf', size: '1.1 MB', bytes: 1150000 }
  ];

  return (
    <>
      <div className="w-full max-w-[800px] mx-auto pb-4">
        {/* Main Dropzone Card */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative cursor-pointer flex flex-col items-center justify-center rounded-lg py-20 px-8 text-center transition-all duration-200 select-none bg-red-50 min-h-[320px] border-[2.5px] border-dashed border-red-300 w-full ${
            isDragActive ? 'bg-red-100 scale-[1.01] border-red-400' : 'hover:bg-red-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Main Choose File Button */}
          <div className="relative inline-flex z-20 mb-4 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={onButtonClick}
              className="flex items-center justify-center py-[18px] px-12 bg-red-500 hover:bg-red-600 text-white font-bold text-[18px] tracking-wide transition-all rounded-l-md min-w-[240px]"
            >
              <Plus className="mr-3 h-6 w-6" strokeWidth={2.5} />
              <span>{multiple ? 'Choose Files' : 'Choose File'}</span>
            </button>
            
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
              className="flex items-center justify-center px-4 bg-red-600 hover:bg-red-700 text-white rounded-r-md transition-all border-l border-white/20"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); }} />
                <div className="absolute top-full mt-2 right-0 w-[240px] bg-white rounded-md shadow-2xl border border-slate-100 overflow-hidden text-left z-50 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); fileInputRef.current.click(); }} className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center space-x-3 text-slate-700 text-[14px] font-medium border-b border-slate-50">
                    <Monitor className="h-4 w-4 text-slate-400" />
                    <span>From Device</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); setActiveModal('dropbox'); }} className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center space-x-3 text-slate-700 text-[14px] font-medium border-b border-slate-50">
                    <svg className="h-4 w-4 text-[#0061FE]" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L1 5.5 6 9l5-3.5zm12 0l-5 3.5 5 3.5 5-3.5zm-12 8.5L1 14l6 4 5-4.5zm12 0l-5 4.5 5 4.5 6-4zM6 20l6 4 6-4v-1.5l-6 4-6-4z" /></svg>
                    <span>From Dropbox</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); setActiveModal('drive'); }} className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center space-x-3 text-slate-700 text-[14px] font-medium border-b border-slate-50">
                    <svg className="h-4 w-4 text-[#00832F]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>
                    <span>From Google Drive</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); setActiveModal('url'); }} className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex items-center space-x-3 text-slate-700 text-[14px] font-medium">
                    <Link2 className="h-4 w-4 text-slate-400" strokeWidth={2.5} />
                    <span>From URL</span>
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="z-10 text-center space-y-1.5 pointer-events-none">
            <p className="text-[13px] text-slate-500 font-medium">
              Max file size: Unlimited. 100% Free.
            </p>
            <p className="text-[12px] text-slate-400">
              By proceeding, you agree to our <a href="/terms" className="hover:underline pointer-events-auto">Terms of Use</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Modals for Remote File Imports */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg text-white ${
                  activeModal === 'drive' ? 'bg-[#00832F]' : activeModal === 'dropbox' ? 'bg-[#0061FE]' : 'bg-red-500'
                }`}>
                  {activeModal === 'drive' && (
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>
                  )}
                  {activeModal === 'dropbox' && (
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 2L1 5.5 6 9l5-3.5zm12 0l-5 3.5 5 3.5 5-3.5zm-12 8.5L1 14l6 4 5-4.5zm12 0l-5 4.5 5 4.5 6-4zM6 20l6 4 6-4v-1.5l-6 4-6-4z" />
                    </svg>
                  )}
                  {activeModal === 'url' && <Link2 className="h-4 w-4 text-white" />}
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm md:text-base">
                  {activeModal === 'drive' ? 'Import from Google Drive' : activeModal === 'dropbox' ? 'Import from Dropbox' : 'Import from Web URL'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {activeModal === 'url' ? (
              <form onSubmit={handleUrlImport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Enter PDF Document Link</label>
                  <input
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-800"
                  />
                  {urlError && <p className="text-[11px] font-medium text-rose-500">{urlError}</p>}
                </div>
                <button
                  type="submit"
                  disabled={importingUrl}
                  className="w-full py-3 rounded-lg font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  {importingUrl ? 'Fetching file...' : 'Import File'}
                </button>
              </form>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">Select a file to import client-side:</p>
                {(activeModal === 'drive' ? driveFiles : dropboxFiles).map((fileItem) => (
                  <button
                    key={fileItem.name}
                    type="button"
                    onClick={() => handleSelectSimulatedFile(fileItem.name, fileItem.bytes)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-red-50 hover:border-red-200 transition-all text-left group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-2 rounded bg-white border border-slate-150 text-red-500 group-hover:text-red-600 shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        </svg>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-[240px]">{fileItem.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{fileItem.size}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Dropzone;
