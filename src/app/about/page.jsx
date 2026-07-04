"use client";

import React from 'react';
import { Cpu, ShieldCheck, Heart, Users } from 'lucide-react';

function About() {
  return (
    <>
      <div className="max-w-4xl mx-auto space-y-12 py-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
        
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold   font-display">
            Methodology & Privacy Architecture
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            How Word to PDF Converter delivers 100% private, offline-capable PDF processing directly in your browser.
          </p>
        </div>

        {/* Main Content */}
        <div className="glass-card p-8 md:p-12 space-y-12 prose prose-invert max-w-none">
          <section>
            <h2 className="text-3xl font-bold border-b border-slate-800 pb-2 mb-6">The"Zero-Upload" Paradigm</h2>
            <p className="text-slate-300 text-lg">
              Traditional online PDF converters operate on a client-server model: you upload your confidential document to a remote server, the server processes the file, and then you download the result. This creates significant vulnerabilities, including data intercepts, temporary storage leaks, and compliance violations (GDPR, HIPAA).
            </p>
            <p className="text-slate-300 text-lg mt-4">
              <strong>Word to PDF Converter</strong> flips this model. We deliver the processing engine to your browser. Utilizing modern WebAssembly (Wasm) and advanced JavaScript engines, all cryptographic, parsing, and rendering operations happen strictly within the memory sandbox of your local device.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold border-b border-slate-800 pb-2 mb-6">Proprietary Benchmarks: Client-Side vs Server-Based</h2>
            
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Metric</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary-400 uppercase tracking-wider">Word to PDF Converter (Client-Side)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Typical Server-Based Tool</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-950 divide-y divide-slate-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">Data Transfer (Upload/Download)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-semibold">0 MB (Zero Transfer)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">2x File Size</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">Server Storage Retention</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-semibold">None (No Servers Used)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">1 to 24 Hours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">Speed (Network Latency)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-semibold">Instant (CPU Bound)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">Slow (Bandwidth Bound)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">Compliance Readiness</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-semibold">Inherent (Data never leaves)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">Requires strict DPAs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="flex items-start space-x-4 p-5 border border-slate-800 bg-slate-950/20 rounded-2xl">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-primary-500 border border-indigo-500/20 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Security-First Focus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Comply with organizational regulations like HIPAA and GDPR. Every byte is processed within your local sandbox.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 border border-slate-800 bg-slate-950/20 rounded-2xl">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-secondary-500 border border-emerald-500/20 shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">WebAssembly Speed</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Run binary compilation algorithms directly on your computer's hardware threads for lightning-fast speeds.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-850 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500" /> Proudly built with developer freedom in mind.</span>
            <span className="mt-2 sm:mt-0 flex items-center gap-1.5"><Users className="h-4 w-4 text-primary-500" /> Used globally by privacy-conscious professionals.</span>
          </div>
        </div>

      </div>
    </>
  );
}

export default About;
