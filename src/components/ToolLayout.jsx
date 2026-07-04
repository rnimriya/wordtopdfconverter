import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, RefreshCw, Loader2, X, Sparkles, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Dropzone from './Dropzone.jsx';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

function ToolLayout({
  title,
  description,
  icon: Icon,
  file,
  onFileSelect,
  onClear,
  preview,
  controls,
  onExecute,
  isExecuting,
  progress = 0,
  successMessage,
  errorMessage,
  seoContent,
  multiple = false,
  accept =".pdf",
  children
}) {
  const router = useRouter();
    
  // SaaS Usage Tracker & Gating States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalReason, setModalReason] = useState('limit-local'); // 'limit-local', 'pro-only', 'file-size'
  const [localConversionsToday, setLocalConversionsToday] = useState(0);

  // Determine if it is a Pro-only tool (AI assistants and PDF OCR)
  const isAiTool = title.toLowerCase().includes('ai') || 
                   title.toLowerCase().includes('chat') || 
                   title.toLowerCase().includes('summariz') || 
                   title.toLowerCase().includes('question') || 
                   title.toLowerCase().includes('translate');
  const isOcr = title.toLowerCase().includes('ocr');
  const isProOnly = isAiTool || isOcr;

  // File size ceilings
  const isPro = false;
  const maxFileSizeMB = 50;

  // Sync usage configurations on load or execution change
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const localData = JSON.parse(localStorage.getItem('pdf_conversions') || '{}');
    if (localData.date === todayStr) {
      setLocalConversionsToday(localData.count || 0);
    } else {
      setLocalConversionsToday(0);
    }
  }, [isExecuting]);

  // Handle conversion execution checking
  const handleExecuteClick = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // 1. Pro feature gate
    if (isProOnly && !isPro) {
      setModalReason('pro-only');
      setShowUpgradeModal(true);
      return;
    }

    // 2. File size ceiling gate
    if (file) {
      const filesArray = Array.isArray(file) ? file : [file];
      for (const f of filesArray) {
        const fileSizeMB = f.size / 1024 / 1024;
        if (fileSizeMB > maxFileSizeMB) {
          setModalReason('file-size');
          setShowUpgradeModal(true);
          return;
        }
      }
    }

    // 3. Conversion count gate
    if (localConversionsToday >= 5) {
      setModalReason('limit-local');
      setShowUpgradeModal(true);
      return;
    }

    // Record local usage increment
    const todayStr = new Date().toISOString().split('T')[0];
    const localData = { date: todayStr, count: localConversionsToday + 1 };
    localStorage.setItem('pdf_conversions', JSON.stringify(localData));
    setLocalConversionsToday(localConversionsToday + 1);

    if (onExecute) {
      onExecute();
    }
  };

  // Dynamic step instructions helper for copywriting
  const getStepGuideData = (titleStr) => {
    const t = titleStr.toLowerCase();
    if (t.includes('merge')) {
      return {
        action: 'merge PDF files',
        step1Title: 'Upload Documents',
        step1Desc: 'Select or drag-and-drop the multiple PDF files you want to combine. You can add more files at any point.',
        step2Title: 'Arrange Order',
        step2Desc: 'Reorder the pages or files to set your preferred final sequence. For large print merges, verify page size compatibility (A4 vs US Letter) to ensure uniform printing.',
        step3Title: 'Merge & Save',
        step3Desc: 'Click the convert button. Your combined PDF will be compiled in local memory and downloaded instantly, keeping all layout streams intact.'
      };
    } else if (t.includes('rotate')) {
      return {
        action: 'rotate PDF pages',
        step1Title: 'Select PDF',
        step1Desc: 'Upload the PDF document that needs rotation adjustments from your local drive.',
        step2Title: 'Choose Angles',
        step2Desc: 'Select individual pages or rotate all pages to match your preferred orientation. Essential for aligning scanned landscapes or upside-down mobile scans.',
        step3Title: 'Apply & Save',
        step3Desc: 'Click convert. Your newly oriented document is rewritten in memory and downloaded without re-compressing underlying image streams.'
      };
    } else if (t.includes('protect')) {
      return {
        action: 'protect PDF files',
        step1Title: 'Upload PDF',
        step1Desc: 'Upload the sensitive document you wish to encrypt with a password.',
        step2Title: 'Set Password',
        step2Desc: 'Enter a strong open password to apply standard AES/RC4 encryption. Note: We operate a zero-upload model, so write it down safely; we cannot recover passwords.',
        step3Title: 'Secure File',
        step3Desc: 'Confirm settings. Your file is encrypted in-browser and downloaded safely, locking copying, editing, or printing based on your chosen rules.'
      };
    } else if (t.includes('compress')) {
      return {
        action: 'compress PDF sizes',
        step1Title: 'Upload PDF',
        step1Desc: 'Select the large PDF file you want to compress and optimize for web sharing.',
        step2Title: 'Choose Level',
        step2Desc: 'Choose your preferred optimization level. Recommended compression scales image resolutions to 150 DPI and wipes metadata without sacrificing text sharpness.',
        step3Title: 'Save Smaller PDF',
        step3Desc: 'Download your optimized, light PDF directly in seconds, bypassing long network upload and download cycles.'
      };
    } else if (t.includes('ocr')) {
      return {
        action: 'perform OCR on PDF',
        step1Title: 'Upload Scanned PDF',
        step1Desc: 'Select the scanned PDF or image containing text you want to extract.',
        step2Title: 'Run OCR',
        step2Desc: 'Configure language options and run local optical character recognition. Clean typefaces yield near-perfect text extraction; handwritten notes or cursive styles may vary.',
        step3Title: 'Save Text',
        step3Desc: 'Instantly download your extracted text contents as an editable file or copy it straight to your clipboard.'
      };
    } else if (t.includes('extract image')) {
      return {
        action: 'extract images from PDF',
        step1Title: 'Upload PDF',
        step1Desc: 'Upload the PDF containing embedded raster images you want to extract.',
        step2Title: 'Select Format',
        step2Desc: 'Let the client engine scan pages and prepare images for extraction. This extracts raw embedded bitmap assets without lossy re-rendering, retaining original DPI.',
        step3Title: 'Download Zip',
        step3Desc: 'Download the extracted images packed in a convenient ZIP archive directly to your downloads directory.'
      };
    } else if (t.includes('word to pdf')) {
      return {
        action: 'convert Word to PDF',
        step1Title: 'Upload DOCX',
        step1Desc: 'Select the Microsoft Word (.docx) document from your device.',
        step2Title: 'Format Page',
        step2Desc: 'Verify layout alignment. Our client library parses document styles and margins; we recommend reviewing double columns or custom page breaks to avoid trailing empty spaces.',
        step3Title: 'Download PDF',
        step3Desc: 'Get your professionally formatted PDF document immediately, with embedded styles and hyperlinked text preserved.'
      };
    } else if (t.includes('excel to pdf')) {
      return {
        action: 'convert Excel to PDF',
        step1Title: 'Upload XLSX',
        step1Desc: 'Choose the spreadsheet workbook (.xlsx) to convert.',
        step2Title: 'Align Grid',
        step2Desc: 'Our engine parses sheet grids to render clean table structures. For wide tables, toggle landscape layout or shrink column widths to keep layout columns inline.',
        step3Title: 'Download PDF',
        step3Desc: 'Download the converted spreadsheet layout as a printable PDF file, complete with page numbering.'
      };
    } else if (t.includes('ppt to pdf')) {
      return {
        action: 'convert PPT to PDF',
        step1Title: 'Upload PPTX',
        step1Desc: 'Select the PowerPoint presentation (.pptx) file.',
        step2Title: 'Prepare Slides',
        step2Desc: 'Convert vector slide layouts in memory, preserving design alignment. Note that dynamic transition animations will compile as static slide layers.',
        step3Title: 'Download PDF',
        step3Desc: 'Download high-quality slides saved as a page-by-page PDF, suitable for digital distribution and presenting.'
      };
    } else if (t.includes('jpg to pdf') || t.includes('png to pdf') || t.includes('image to pdf')) {
      return {
        action: 'convert images to PDF',
        step1Title: 'Select Images',
        step1Desc: 'Upload the photos or image files you want to compile into a single document.',
        step2Title: 'Order & Spacing',
        step2Desc: 'Reorder images and set page margins. Match page fit to portrait or landscape depending on the image aspect ratios to prevent clipping.',
        step3Title: 'Save PDF',
        step3Desc: 'Compile images and download your clean PDF file immediately, with full resolution preserved.'
      };
    } else if (t.includes('text to pdf')) {
      return {
        action: 'convert text to PDF',
        step1Title: 'Enter Text',
        step1Desc: 'Type or paste plain text blocks directly into the input fields.',
        step2Title: 'Configure Font',
        step2Desc: 'Choose text wrapping margins and monospace formatting parameters. Monospace is recommended for code snippets or structured logs.',
        step3Title: 'Download PDF',
        step3Desc: 'Generate the PDF document client-side and download it in seconds, with proper word-wrapping applied.'
      };
    } else if (t.includes('html to pdf')) {
      return {
        action: 'convert HTML to PDF',
        step1Title: 'Input HTML Code',
        step1Desc: 'Type webpage URLs or paste custom HTML code blocks.',
        step2Title: 'Render Layout',
        step2Desc: 'Capture coordinates and prepare responsive print styles. Complex animations or dynamic widgets may render as static screenshots; confirm media query print styles.',
        step3Title: 'Download PDF',
        step3Desc: 'Download your high-fidelity, rendered webpage as a clean PDF, with clickable links preserved.'
      };
    } else if (t.includes('pdf to word')) {
      return {
        action: 'convert PDF to Word',
        step1Title: 'Select PDF',
        step1Desc: 'Upload the PDF document you want to edit in Microsoft Word.',
        step2Title: 'Extract Text',
        step2Desc: 'Wait for the browser engine to parse rows, columns, and characters. Converting complex nested data tables or mathematical formulas may require alignment review post-conversion.',
        step3Title: 'Download DOCX',
        step3Desc: 'Save the output as a fully editable Word file directly to your system, ready for Microsoft Office editing.'
      };
    } else if (t.includes('pdf to excel')) {
      return {
        action: 'convert PDF to Excel',
        step1Title: 'Upload PDF File',
        step1Desc: 'Upload the PDF file containing data grids or tables.',
        step2Title: 'Parse Grid',
        step2Desc: 'The processor automatically groups text segments into rows and columns. Merged cells or overlapping text blocks may require columns review in your spreadsheet software.',
        step3Title: 'Download XLSX',
        step3Desc: 'Download the compiled spreadsheets for further analysis, with numbers and tables mapped into cells.'
      };
    } else if (t.includes('pdf to ppt')) {
      return {
        action: 'convert PDF to PPT',
        step1Title: 'Select PDF',
        step1Desc: 'Choose the PDF presentation pages you want to edit.',
        step2Title: 'Create Slides',
        step2Desc: 'Our layout engine transforms pages into slides with editable elements. Vector paths are preserved, but embedded page animations are omitted.',
        step3Title: 'Download PPTX',
        step3Desc: 'Save presentation files and edit in Microsoft PowerPoint, with layouts restructured into slides.'
      };
    } else if (t.includes('pdf to jpg') || t.includes('pdf to png')) {
      return {
        action: 'convert PDF to images',
        step1Title: 'Upload PDF',
        step1Desc: 'Upload the PDF document you wish to convert into image files.',
        step2Title: 'Select Resolution',
        step2Desc: 'Select target pages and set output format to JPG or PNG. Ideal for creating fast previews or isolating high-resolution page grids.',
        step3Title: 'Save ZIP',
        step3Desc: 'Download rendered pages as high-resolution images or a ZIP archive directly.'
      };
    }

    // Default fallback
    return {
      action: 'process PDF documents',
      step1Title: 'Upload Files',
      step1Desc: 'Select or drag-and-drop the documents you want to process.',
      step2Title: 'Configure Settings',
      step2Desc: 'Adjust compliance options and output settings. Double-check layout flows and fonts for optimal browser-based compilation.',
      step3Title: 'Download File',
      step3Desc: 'Wait for local browser compilation and save your document.'
    };
  };

  const stepGuide = getStepGuideData(title);

  const getRelatedTools = (titleStr) => {
    const t = titleStr.toLowerCase();
    if (t.includes('word') || t.includes('excel') || t.includes('ppt') || t.includes('html') || t.includes('autocad') || t.includes('ebook') || t.includes('iwork') || t.includes('openoffice')) {
      return [
        { title: 'Merge PDF Documents', description: 'Combine multiple PDF files into one clean document.', link: '/merge-pdf' },
        { title: 'Compress PDF Size', description: 'Shrink and optimize your output PDF file size online.', link: '/compress-pdf' }
      ];
    }
    if (t.includes('merge')) {
      return [
        { title: 'Compress PDF Size', description: 'Optimize and reduce size of your compiled PDF document.', link: '/compress-pdf' },
        { title: 'Split PDF Pages', description: 'Extract pages or split your merged PDF into separate files.', link: '/split-pdf' }
      ];
    }
    if (t.includes('compress')) {
      return [
        { title: 'Protect PDF Security', description: 'Encrypt and lock your compressed PDF with strong passwords.', link: '/protect-pdf' },
        { title: 'Merge PDF Documents', description: 'Combine your compressed files into a single document.', link: '/merge-pdf' }
      ];
    }
    if (t.includes('protect') || t.includes('unlock')) {
      return [
        { title: 'Sign PDF Electronic', description: 'Draw, type, or stamp your digital signature on files.', link: '/sign-pdf' },
        { title: 'Compress PDF Size', description: 'Shrink your secure PDF files down for easy email sharing.', link: '/compress-pdf' }
      ];
    }
    if (t.includes('ocr') || t.includes('scan') || t.includes('translate')) {
      return [
        { title: 'Edit PDF Document', description: 'Annotate, draw, write text, and modify PDF pages.', link: '/edit-pdf' },
        { title: 'PDF Scanner Tool', description: 'Scan paper documents from camera and compile to PDF.', link: '/pdf-scanner' }
      ];
    }
    if (t.includes('edit') || t.includes('annotate') || t.includes('redact') || t.includes('sign') || t.includes('watermark')) {
      return [
        { title: 'Flatten PDF Fields', description: 'Flatten forms and layers to make edits permanent.', link: '/flatten-pdf' },
        { title: 'Protect PDF Security', description: 'Lock your finalized, signed document with passwords.', link: '/protect-pdf' }
      ];
    }
    // Default fallback
    return [
      { title: 'Merge PDF Documents', description: 'Combine multiple PDF files into a single document.', link: '/merge-pdf' },
      { title: 'Compress PDF Size', description: 'Shrink and optimize your PDF file size in your browser.', link: '/compress-pdf' }
    ];
  };

  const relatedTools = getRelatedTools(title);

  useEffect(() => {
    // 1. Set page title and meta description dynamically
    const originalTitle = document.title;
    document.title = `Free ${title} Online | 100% Private Word To PDF Convertor`;

    let metaDesc = document.querySelector('meta[name="description"]');
    let originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    const newDesc = `${title} tool. Edit, convert, and process your files directly inside your browser cache with 100% security. No uploads, zero limitations, and completely free.`;
    
    if (metaDesc) {
      metaDesc.setAttribute('content', newDesc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name ="description";
      metaDesc.content = newDesc;
      document.head.appendChild(metaDesc);
    }

    
    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      
    };
  }, [title]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full px-2 sm:px-4">
      {/* Left Ad Column */}
      <div className="hidden xl:block xl:col-span-2 relative">
        <div className="sticky top-[100px] w-full h-[600px] bg-slate-100/50 border border-slate-200/50 rounded-xl flex items-center justify-center overflow-hidden">
          <p className="text-slate-400 text-xs font-medium rotate-[-90deg] tracking-widest uppercase">Advertisement</p>
        </div>
      </div>

      {/* Center Tool Column */}
      <div className="col-span-1 xl:col-span-8 space-y-8 min-w-0 pb-12">
      
      {/* Tool Header (FreeConvert Aesthetic) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-10 pb-6">
        <h1 className="text-[42px] leading-tight font-bold text-[#282f3a] flex flex-col sm:flex-row items-center justify-center gap-3">
          <span>{title}</span>
          
        </h1>
        <p className="text-[18px] text-slate-600 font-medium">
          {description}
        </p>
      </div>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto">
        {file ? (
          children ? (
            /* Overridden workspace layout (used by components that list multiple files) */
            <div className="glass-card p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
              {children}
            </div>
          ) : preview ? (
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
              {/* File Preview Panel (7 columns on desktop) */}
              <div className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-150">
                  <div className="flex items-center space-x-4 truncate pr-4">
                     <div className="p-3 bg-rose-50 text-rose-500 rounded-xl shrink-0">
                       <FileText className="h-7 w-7" />
                     </div>
                     <div className="truncate">
                       <p className="font-bold text-slate-900 truncate text-sm md:text-base">
                         {Array.isArray(file) ? `${file.length} files selected` : file.name}
                       </p>
                       <p className="text-xs text-slate-500 font-medium mt-0.5">
                         {Array.isArray(file) 
                          ? `${file.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024 ? (file.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2) : 0} MB`
                          : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        }
                       </p>
                     </div>
                  </div>
                  
                  <button 
                    onClick={onClear}
                    disabled={isExecuting}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Change File</span>
                  </button>
                </div>

                {/* PDFPreview component placeholder handled in the tool page */}
                <div className="w-full">
                  {preview}
                </div>
              </div>

              {/* Configurations & Action Panel (5 columns on desktop) */}
              <div className="lg:col-span-5 glass-card p-6 md:p-8 space-y-6 flex flex-col">
                <h3 className="font-display font-bold text-xl text-slate-900 border-b border-slate-150 pb-4">
                  Configure Settings
                </h3>
                
                {/* Form Controls */}
                <div className="space-y-4 flex-grow">
                  {controls}
                </div>

                {/* Status/Error Messages */}
                {errorMessage && (
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-sm font-medium flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-sm font-medium flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Progress bar */}
                {isExecuting && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                        Processing document...
                      </span>
                      <span className="font-bold text-primary-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-primary-500 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  onClick={handleExecuteClick}
                  disabled={isExecuting}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-[16px] py-4 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 group"
                >
                  {isExecuting ? 'Processing...' : (
                    <>
                      Convert & Download
                      <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-300">
              <div className="glass-card p-8 md:p-10 flex flex-col space-y-8">
                {/* File selection box */}
                <div className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-4 truncate pr-4">
                    <div className="p-3.5 bg-rose-50 text-rose-500 rounded-xl shrink-0">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate text-base">
                        {Array.isArray(file) ? `${file.length} files selected` : file.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                         {Array.isArray(file) 
                          ? `${file.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024 ? (file.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2) : 0} MB`
                          : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        }
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClear}
                    disabled={isExecuting}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-sm font-semibold text-slate-700 transition-all disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Change</span>
                  </button>
                </div>

                <div className="w-full h-px bg-slate-100"></div>

                {/* Configurations & Action Panel */}
                <div className="space-y-6">
                  {controls && (
                    <>
                      <h3 className="font-display font-bold text-xl text-slate-900">
                        Processing Options
                      </h3>
                      <div className="space-y-4">
                        {controls}
                      </div>
                    </>
                  )}

                  {/* Status/Error Messages */}
                  {errorMessage && (
                    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-sm font-medium flex items-start gap-2">
                      <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-sm font-medium flex items-start gap-2">
                      <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Progress bar */}
                  {isExecuting && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                          Processing document...
                        </span>
                        <span className="font-bold text-primary-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                        <div 
                          className="bg-primary-500 h-full rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Primary Button */}
                  <button
                    onClick={handleExecuteClick}
                    disabled={isExecuting}
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 group mt-2"
                  >
                    {isExecuting ? 'Processing...' : (
                      <>
                        Convert & Download
                        <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* File selection Dropzone */
          <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-300">
            <Dropzone 
              onFileSelect={onFileSelect} 
              accept={accept} 
              multiple={multiple} 
              title={title}
              description={description}
            />
          </div>
        )}
      </div>

      {/* Social Share Buttons */}
      <div className="max-w-5xl mx-auto flex justify-center items-center gap-4 mt-6">
        <span className="text-sm font-semibold text-slate-500">Share this tool:</span>
        <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
          <FaFacebook size={18} />
        </button>
        <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check+out+this+free+PDF+tool!`, '_blank')} className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
          <FaTwitter size={18} />
        </button>
        <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
          <FaLinkedin size={18} />
        </button>
        <button onClick={() => window.open(`https://api.whatsapp.com/send?text=Check+out+this+free+PDF+tool!%20${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
          <FaWhatsapp size={18} />
        </button>
      </div>

      {/* Section 1: How it Works (3-Step Guide) - High Fidelity Card Style */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">
            How to use our free {title} tool in three simple steps
          </h2>
          <p className="text-sm text-slate-555 max-w-2xl mx-auto">
            Follow our clean, secure, and fast three-step guide to run {title.toLowerCase()} operations on your documents in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Step 1 */}
          <article className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-36 bg-gradient-to-br from-indigo-100 via-slate-100 to-violet-200 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
              {/* Mockup UI 1: Choose File */}
              <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200/60 shadow-md text-xs text-slate-700 font-bold flex items-center space-x-2 w-48 relative">
                <div className="p-1.5 rounded-lg bg-red-50 text-red-500 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="truncate">Select PDF document</span>
              </div>
              
              {/* Clicking Cursor Overlay */}
              <svg 
                className="absolute h-8 w-8 drop-shadow-md select-none pointer-events-none animate-bounce"
                style={{ bottom: '15%', right: '28%', animationDuration: '2s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5.5 10.5C5.5 9.67157 6.17157 9 7 9C7.82843 9 8.5 9.67157 8.5 10.5V11.5M8.5 11.5C8.5 10.6716 9.17157 10 10 10C10.8284 10 11.5 10.6716 11.5 11.5M11.5 11.5C11.5 10.6716 12.1716 10 13 10C13.8284 10 14.5 10.6716 14.5 11.5V13.5M14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5V16C17.5 19.5 15 22 11.5 22H9.5C6.5 22 4.5 19.5 4.5 16.5V12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
                <path 
                  d="M7.5 9V4.5C7.5 3.67157 8.17157 3 9 3C9.82843 3 10.5 3.67157 10.5 4.5V10.5" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="p-5 flex flex-col items-center text-center space-y-2 flex-grow">
              <h3 className="font-display font-bold text-base text-rose-600">{stepGuide.step1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {stepGuide.step1Desc}
              </p>
            </div>
          </article>

          {/* Card 2: Step 2 */}
          <article className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-36 bg-gradient-to-br from-violet-100 via-indigo-100 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
              {/* Mockup UI 2: Settings Toggles */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-md flex flex-col space-y-1.5 w-44 relative">
                <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-12 bg-rose-100 rounded-lg"></div>
                  <div className="h-4.5 w-8 bg-rose-500 rounded-full flex items-center px-0.5">
                    <div className="h-3.5 w-3.5 rounded-full bg-white translate-x-3.5"></div>
                  </div>
                </div>
              </div>

              {/* Clicking Cursor Overlay */}
              <svg 
                className="absolute h-8 w-8 drop-shadow-md select-none pointer-events-none animate-bounce"
                style={{ bottom: '15%', right: '28%', animationDuration: '2s', animationDelay: '0.3s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5.5 10.5C5.5 9.67157 6.17157 9 7 9C7.82843 9 8.5 9.67157 8.5 10.5V11.5M8.5 11.5C8.5 10.6716 9.17157 10 10 10C10.8284 10 11.5 10.6716 11.5 11.5M11.5 11.5C11.5 10.6716 12.1716 10 13 10C13.8284 10 14.5 10.6716 14.5 11.5V13.5M14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5V16C17.5 19.5 15 22 11.5 22H9.5C6.5 22 4.5 19.5 4.5 16.5V12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
                <path 
                  d="M7.5 9V4.5C7.5 3.67157 8.17157 3 9 3C9.82843 3 10.5 3.67157 10.5 4.5V10.5" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="p-5 flex flex-col items-center text-center space-y-2 flex-grow">
              <h3 className="font-display font-bold text-base text-rose-600">{stepGuide.step2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {stepGuide.step2Desc}
              </p>
            </div>
          </article>

          {/* Card 3: Step 3 */}
          <article className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-36 bg-gradient-to-br from-blue-100 via-violet-100 to-indigo-200 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
              {/* Mockup UI 3: Download Button */}
              <div className="bg-primary-500 text-white rounded-xl px-5 py-2.5 shadow-md font-bold text-xs flex items-center space-x-1.5 w-44 justify-center">
                <span>Download file</span>
              </div>

              {/* Clicking Cursor Overlay */}
              <svg 
                className="absolute h-8 w-8 drop-shadow-md select-none pointer-events-none animate-bounce"
                style={{ bottom: '15%', right: '28%', animationDuration: '2s', animationDelay: '0.6s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5.5 10.5C5.5 9.67157 6.17157 9 7 9C7.82843 9 8.5 9.67157 8.5 10.5V11.5M8.5 11.5C8.5 10.6716 9.17157 10 10 10C10.8284 10 11.5 10.6716 11.5 11.5M11.5 11.5C11.5 10.6716 12.1716 10 13 10C13.8284 10 14.5 10.6716 14.5 11.5V13.5M14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5V16C17.5 19.5 15 22 11.5 22H9.5C6.5 22 4.5 19.5 4.5 16.5V12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
                <path 
                  d="M7.5 9V4.5C7.5 3.67157 8.17157 3 9 3C9.82843 3 10.5 3.67157 10.5 4.5V10.5" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="p-5 flex flex-col items-center text-center space-y-2 flex-grow">
              <h3 className="font-display font-bold text-base text-rose-600">{stepGuide.step3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {stepGuide.step3Desc}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Section 4: Related Tools (Internal Linking) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 max-w-5xl mx-auto shadow-sm space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
          Need to do more with your files?
        </h2>
        <p className="text-sm text-slate-600 font-sans">
          Try these related free, secure client-side tools next:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedTools.map((tool, idx) => (
            <Link 
              key={idx}
              href={tool.link}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-red-50 hover:border-red-200 transition-all group"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-850 text-sm group-hover:text-primary-600 transition-colors font-display">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  {tool.description}
                </p>
              </div>
              <span className="text-primary-500 font-bold text-lg group-hover:translate-x-1 transition-transform shrink-0 pl-2">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Copywritten SEO Content */}
      {seoContent && (
        <section className="max-w-4xl mx-auto border-t border-slate-200 pt-12 space-y-8">
          {seoContent}
        </section>
      )}

      </div>

      {/* Right Ad Column */}
      <div className="hidden xl:block xl:col-span-2 relative">
        <div className="sticky top-[100px] w-full h-[600px] bg-slate-100/50 border border-slate-200/50 rounded-xl flex items-center justify-center overflow-hidden">
          <p className="text-slate-400 text-xs font-medium rotate-[-90deg] tracking-widest uppercase">Advertisement</p>
        </div>
      </div>



    </div>
  );
}

export default ToolLayout;
