"use client";

import React, { useState } from 'react';
import { FileText, AlertCircle, Lock } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';

function ODTtoPDF() {
  const [file, setFile] = useState(null);

  const controls = (
    <div className="space-y-4">
      <div className="p-4 bg-primary-950/40 border border-primary-900 rounded-xl space-y-2">
        <h4 className="text-sm font-bold text-primary-400 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Enterprise Feature
        </h4>
        <p className="text-xs text-primary-200/70 leading-relaxed">
          ODT to PDF conversion requires dedicated rendering engines (like LibreOffice or CAD binaries). This feature is currently in development for our Enterprise tier.
        </p>
      </div>
      <button className="w-full glass-button text-xs flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed" disabled>
        <FileText className="h-4 w-4" />
        <span>Coming Soon</span>
      </button>
    </div>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ODT to PDF",
    "url": "https://wordtopdfconverter.online/odt-to-pdf",
    "description": "Convert ODT to PDF online.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any"
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">ODT to PDF - Enterprise Grade Conversion</h1>
        <p className="text-slate-400 text-lg">
          We are building dedicated rendering engines to accurately convert proprietary formats. Stay tuned for the release of our Enterprise conversion tools.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolLayout
        title="ODT to PDF"
        description="Coming Soon to Enterprise Tier"
        icon={FileText}
        file={file}
        onFileSelect={(f) => setFile(f)}
        onClear={() => setFile(null)}
        controls={controls}
        onExecute={() => {}}
        isExecuting={false}
        progress={0}
        successMessage=""
        errorMessage=""
        seoContent={seoContent}
      />
    </>
  );
}

export default ODTtoPDF;