import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 font-sans text-slate-300 relative overflow-hidden">
      {/* Abstract Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2"></div>
      
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Main Footer Links & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-16 mb-20">
          
          {/* Brand & Description (4 columns) */}
          <div className="md:col-span-12 lg:col-span-5">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <img src="/wtpc.png" alt="Word To PDF Converter" className="h-10 w-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
              <span className="font-bold text-2xl tracking-tight text-white font-display">
                Word To PDF <span className="text-primary-500">Converter</span>
              </span>
            </Link>
            <p className="text-[15px] text-slate-400 leading-relaxed max-w-sm mb-8 font-light">
              The smartest, fastest, and most secure client-side platform to convert, merge, and edit your PDF documents without cloud uploads.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-slate-800/50 shadow-sm border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all">
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-slate-800/50 shadow-sm border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all">
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
              <a href="https://github.com/rnimriya/wordtopdfconverter" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800/50 shadow-sm border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all">
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Grid (8 columns) */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Products */}
            <div>
              <h4 className="font-bold text-white text-base mb-6 font-display">Core Solutions</h4>
              <ul className="space-y-4">
                <li><Link href="/word-to-pdf" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Word to PDF</Link></li>
                <li><Link href="/merge-pdf" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Merge PDF</Link></li>
                <li><Link href="/split-pdf" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Split PDF</Link></li>
                <li><Link href="/compress-pdf" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Compress PDF</Link></li>
                <li><Link href="/ai-pdf-assistant" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors flex items-center gap-2">AI Assistant <span className="px-1.5 py-0.5 rounded-md bg-primary-500/20 text-primary-400 border border-primary-500/20 text-[10px] font-bold uppercase tracking-wider">New</span></Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white text-base mb-6 font-display">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Contact</Link></li>
                <li><Link href="/pricing" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white text-base mb-6 font-display">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="text-[14px] text-slate-400 font-medium hover:text-primary-400 transition-colors">Security Architecture</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-800 text-[13px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Word To PDF Converter. All rights reserved. Built with WebAssembly.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="flex items-center text-slate-400 cursor-pointer font-medium hover:text-white transition-colors">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              English
            </span>
            <span className="flex items-center text-slate-400 font-medium gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
