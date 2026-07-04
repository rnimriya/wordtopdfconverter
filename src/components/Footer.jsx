import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 pt-16 pb-8 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Top Section: Main Footer Links & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Description (4 columns) */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img src="/wtpc.png" alt="Word To PDF Converter" className="h-9 w-auto drop-shadow-sm" />
              <span className="font-bold text-xl tracking-tight text-slate-900 font-display">
                Word To PDF <span className="text-primary-600">Converter</span>
              </span>
            </Link>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-sm mb-6">
              The smartest, fastest way to convert, merge, and edit your PDF documents for free. We make working with PDFs incredibly easy.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Grid (8 columns) */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Products */}
            <div>
              <h4 className="font-bold text-slate-900 text-[15px] mb-5 font-display tracking-wide">Solutions</h4>
              <ul className="space-y-3.5">
                <li><Link href="/word-to-pdf" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Word to PDF</Link></li>
                <li><Link href="/merge-pdf" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Merge PDF</Link></li>
                <li><Link href="/split-pdf" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Split PDF</Link></li>
                <li><Link href="/compress-pdf" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Compress PDF</Link></li>
                <li><Link href="/ai-pdf-assistant" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors flex items-center gap-1.5">AI PDF Assistant <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">New</span></Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-slate-900 text-[15px] mb-5 font-display tracking-wide">Company</h4>
              <ul className="space-y-3.5">
                <li><Link href="/about" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Contact</Link></li>
                <li><Link href="/pricing" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-slate-900 text-[15px] mb-5 font-display tracking-wide">Legal</h4>
              <ul className="space-y-3.5">
                <li><Link href="/privacy" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="text-[14px] text-slate-500 font-medium hover:text-primary-600 transition-colors">Security Details</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200/80 text-[13px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Word To PDF Converter. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="flex items-center text-slate-700 cursor-pointer font-medium hover:text-primary-600 transition-colors">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              English
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
