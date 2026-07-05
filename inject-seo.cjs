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
        <h1 className="text-3xl font-bold font-display text-white">Secure ${toolName} - 100% Private Cloud Processing</h1>
        <p className="text-slate-400 text-lg">
          Our advanced online ${toolName} tool makes it effortless to ${actionWord} documents securely in seconds. Whether you need to finalize a presentation, share a business contract, or lock in academic formatting, our tool ensures your document looks exactly the same on any device.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">How to ${toolName} Online Without Losing Formatting</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Upload Document</h3>
            <p className="text-sm text-slate-500">Drag and drop your file into the secure upload area.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Secure Transfer</h3>
            <p className="text-sm text-slate-500">Files are transmitted over an encrypted 256-bit SSL connection.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. API Processing</h3>
            <p className="text-sm text-slate-500">Our engine executes the ${actionType} with pixel-perfect accuracy.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">4. Instant Download</h3>
            <p className="text-sm text-slate-500">Save the perfectly formatted file directly to your device.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Security & Privacy Guarantee</h2>
        <p className="text-slate-400">
          <strong>Enterprise-Grade Security:</strong> Trust is our priority. We employ strict, zero-retention data policies to protect your sensitive information. All file uploads and downloads are routed through 256-bit SSL/TLS encrypted channels, preventing interception. Once your ${actionType} is complete, our automated systems permanently wipe your files from our servers within a maximum of 2 hours. We do not read, analyze, or share your document contents with any third parties.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Will my converted file look exactly like the original?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Our ${toolName} uses advanced layout mapping to ensure your fonts, margins, images, and tables remain perfectly intact during the process.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is it safe to process confidential documents online?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes, it is completely safe. All file transfers are secured with SSL encryption, and your documents are permanently deleted from our cloud servers within 2 hours.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Can I use this tool on my iPhone or Android?</h3>
            <p className="text-slate-400 text-sm mt-1">Yes. Our web-based tool is fully responsive and cloud-powered, allowing you to seamlessly process documents on any mobile browser without downloading an app.</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Is there a file size limit for the free tool?</h3>
            <p className="text-slate-400 text-sm mt-1">No arbitrary limits are enforced for free usage. Our enterprise-grade cloud servers process even massive files in seconds.</p>
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
