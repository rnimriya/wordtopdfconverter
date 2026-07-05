"use client";

import React, { useState } from 'react';
import { Cpu, Send, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';

function AiAssistant() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setChat([
      { role: 'assistant', text:"Hello! I am scanning the document structure to extract text analysis layers..." }
    ]);
    
    const text = await extractTextFromPdf(selectedFile);
    setDocumentText(text);
    setLoadingText(false);
    
    setChat([
      { role: 'assistant', text:"Hello! I have loaded your PDF document text successfully. Ask me any question about its contents!" }
    ]);
  };

  const handleSend = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'unsupported');

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
      downloadName = `${file.name.replace(/\.[^/.]+$/, '')}-unsupported.pdf`;
      
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

  const controls = (
    <div className="space-y-4">
      <div className="border border-slate-250 rounded-xl bg-slate-50 p-4 max-h-[300px] overflow-y-auto space-y-3">
        {chat.map((msg, i) => (
          <div key={i} className={"p-3 rounded-lg text-xs" + (msg.role === 'user' ? 'bg-primary-50 text-slate-800 ml-4 border border-primary-100' : 'bg-white text-slate-800 mr-4 border border-slate-200')}>
            <span className="font-bold block mb-1 uppercase tracking-wider text-[9px] text-slate-400">{msg.role === 'user' ? 'You' : 'AI'}</span>
            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
        {isExecuting && (
          <div className="p-3 rounded-lg text-xs bg-white text-slate-400 mr-4 border border-slate-100 flex items-center space-x-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="glass-input text-xs py-2.5"
          disabled={!file || loadingText || isExecuting}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button 
          onClick={handleSend} 
          className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 text-xs font-bold shrink-0" 
          disabled={!file || !query.trim() || loadingText || isExecuting}
        >
          Send
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ToolLayout
      title="AI PDF Assistant"
      description="Consult and analyze document layers entirely client-side using advanced AI models."
      icon={Cpu}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={() => { setFile(null); setChat([]); setDocumentText(''); }}
      controls={controls}
      onExecute={() => {}}
      isExecuting={isExecuting || loadingText}
    />
    </>
  );
}

export default AiAssistant;
