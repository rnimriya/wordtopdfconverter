const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'app');

function formatToolName(dirName) {
  return dirName
    .split('-')
    .map(word => {
      if (word.toLowerCase() === 'pdf' || word.toLowerCase() === 'ai' || word.toLowerCase() === 'ocr') return word.toUpperCase();
      if (word.toLowerCase() === 'pdfa') return 'PDF/A';
      if (word.toLowerCase() === 'ppt') return 'PPT';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function getSeoTemplate(toolName, dirName) {
  const isConverter = dirName.includes('to-pdf');
  const actionWord = isConverter ? 'convert' : (dirName.split('-')[0] + ' your');
  const actionType = isConverter ? 'conversion' : 'processing';
  
  const schemaStr = `  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${toolName}",
    "url": "https://wordtopdfconverter.online/${dirName}",
    "description": "A secure, fast, and free online tool to ${actionWord} PDF files with 100% precision.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Perfect layout and formatting retention",
      "256-bit SSL encryption",
      "Automatic file deletion within 2 hours",
      "No registration required"
    ],
    "creator": {
      "@type": "Organization",
      "name": "WordToPDFConverter"
    }
  };`;

  const seoContentStr = `  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">${toolName} Quickly and Securely</h1>
        <p className="text-slate-400 text-lg">
          Need to ${actionWord} without losing your original formatting? Our tool makes it incredibly easy to turn your documents into polished, professional files in just a few seconds. Whether you are finalizing a business contract, submitting a school assignment, or preparing a presentation, you can count on us to make sure your document looks exactly the way you intended on any device. Best of all, you can use our tool to ${actionWord} online completely free of charge.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to ${toolName} Online</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Upload Document</h3>
            <p className="text-sm text-slate-500">Simply drag and drop your file right into our secure upload box.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Secure Transfer</h3>
            <p className="text-sm text-slate-500">Your file is instantly protected by a secure 256-bit SSL connection.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. Fast Processing</h3>
            <p className="text-sm text-slate-500">Our system quickly processes your file while keeping your layout perfectly intact.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">4. Instant Download</h3>
            <p className="text-sm text-slate-500">Save your new, cleanly formatted file directly to your device and you are good to go!</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Your Privacy and Security Come First</h2>
        <p className="text-slate-400">
          We know how important your privacy is. When you use our free ${toolName} tool, you can rest easy knowing we have strict security measures in place. Every file you upload and download is encrypted, meaning no one can intercept your data. To keep your information totally private, our system automatically and permanently deletes your files from our servers within two hours of your ${actionType}. We never read, analyze, or share your documents with anyone.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Will my output look exactly like my original document?</h3>
            <p className="text-slate-400 text-sm mt-1">Absolutely. We use advanced formatting technology to make sure your fonts, images, margins, and tables look perfect and remain exactly where you put them.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is it safe to upload confidential documents?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes, it is completely safe. We use strong SSL encryption for all file transfers, and we permanently wipe your files from our secure servers within two hours.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Can I process files on my phone?</h3>
            <p className="text-slate-400 text-sm mt-1">You sure can! Our website is fully optimized for mobile devices, so you can easily ${actionWord} online using your iPhone or Android browser—no extra apps required.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Are there file size limits for the free tool?</h3>
            <p className="text-slate-400 text-sm mt-1">We do not put strict limits on file sizes for everyday use. Our powerful cloud servers are designed to handle even large documents quickly and efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );\n\n`;

  return schemaStr + '\n\n' + seoContentStr;
}

const dirs = fs.readdirSync(SRC_DIR).filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory());

let updatedCount = 0;

for (const dir of dirs) {
  const pagePath = path.join(SRC_DIR, dir, 'page.jsx');
  if (!fs.existsSync(pagePath)) continue;

  let content = fs.readFileSync(pagePath, 'utf8');
  
  const schemaRegex = /const schema\s*=\s*\{[\s\S]*?const seoContent\s*=\s*\([\s\S]*?\);\s*(return\s*\()/;
  
  if (schemaRegex.test(content)) {
    const toolName = formatToolName(dir);
    const replacement = getSeoTemplate(toolName, dir) + '$1';
    
    const newContent = content.replace(schemaRegex, replacement);
    
    fs.writeFileSync(pagePath, newContent);
    console.log('Injected SEO for', toolName);
    updatedCount++;
  } else {
    // If not found, maybe they are defined separately or have different spacing
    console.log('Could not match schema/seoContent block in', dir);
  }
}

console.log('Successfully injected SEO into', updatedCount, 'tools.');
