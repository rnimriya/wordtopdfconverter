"use client";

import React, { useState } from 'react';
import { HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';
import confetti from 'canvas-confetti';

function QuestionGenerator() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setQuestions('');
    setErrorMessage('');
    
    try {
      const text = await extractTextFromPdf(selectedFile);
      if (!text || text.trim().length === 0) {
        throw new Error("Could not extract any text from this PDF.");
      }
      setDocumentText(text);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to extract text from PDF.");
    } finally {
      setLoadingText(false);
    }
  };

  const handleGenerate = async () => {
    if (!file || !documentText) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'question_generator',
          documentText: documentText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      setQuestions(data.result);
      setSuccessMessage("Questions generated successfully!");
      
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          AI Analysis
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This tool uses AI to read the text of your document and generate educational Q&A pairs.
        </p>
      </div>

      <button 
        onClick={handleGenerate} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || loadingText || isExecuting || !documentText}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <HelpCircle className="h-4 w-4" />
            <span>Generate Q&A</span>
          </>
        )}
      </button>
      
      {loadingText && (
        <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center animate-pulse">
          Extracting text from PDF layout...
        </div>
      )}

      {questions && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white mb-2">Generated Questions</h3>
          <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-900 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
            {questions}
          </div>
        </div>
      )}
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Question Generator",
    "url": "https://wordtopdfconverter.online/ai-question-generator",
    "description": "Generate questions and answers from a PDF.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">AI Question Generator</h1>
        <p className="text-slate-400 text-lg">
          Generate quizzes, questions, and answers from any PDF document.
        </p>
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
        title="AI Question Generator"
        description="Generate study questions from your PDF."
        icon={HelpCircle}
        file={file}
        onFileSelect={handleFileSelect}
        onClear={() => { setFile(null); setQuestions(''); setDocumentText(''); setSuccessMessage(''); setErrorMessage(''); }}
        controls={controls}
        onExecute={handleGenerate}
        isExecuting={isExecuting || loadingText}
        progress={isExecuting ? 50 : 0}
        successMessage={successMessage}
        errorMessage={errorMessage}
        seoContent={seoContent}
        preview={<PDFPreview file={file} pageNumber={1} scale={0.8} />}
      />
    </>
  );
}

export default QuestionGenerator;
