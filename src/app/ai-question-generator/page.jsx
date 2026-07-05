"use client";

import React, { useState } from 'react';
import { FileCode } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function QuestionGen() {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleGenerate = async () => {
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
      <button onClick={handleGenerate} className="w-full glass-button-primary text-xs" disabled={!file}>Generate Flashcards</button>
      {quiz.map((item, idx) => (
        <div key={idx} className="p-3 border rounded-xl bg-slate-50 text-xs">
          <p className="font-bold text-slate-800">Q: {item.q}</p>
          <p className="text-slate-650 mt-1">A: {item.a}</p>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <ToolLayout
      title="AI Question Generator"
      description="Create study questions and flashcards from document content."
      icon={FileCode}
      file={file}
      onFileSelect={(f) => { setFile(f); setQuiz([]); }}
      onClear={() => { setFile(null); setQuiz([]); }}
      controls={controls}
      onExecute={handleGenerate}
      isExecuting={isExecuting}
    />
    </>
  );
}

export default QuestionGen;
