const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../src/app');

const SKIP_DIRS = [
  'about', 'api', 'contact', 'dashboard', 'forgot-password', 
  'login', 'pricing', 'privacy', 'reset-password', 'signup', 
  'sitemap', 'terms', 'ai-pdf-assistant', 'ai-pdf-summarizer',
  'ai-question-generator', 'chat-with-pdf'
];

function formatToolName(dirName) {
  return dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('Pdf', 'PDF')
    .replace('Jpg', 'JPG')
    .replace('Png', 'PNG')
    .replace('Ppt', 'PPT')
    .replace('Ocr', 'OCR')
    .replace('Odt', 'ODT')
    .replace('Rtf', 'RTF');
}

function generateSeoContent(toolName, dirName) {
  const actionVerb = toolName.split(' ')[0]; 
  
  let specificVocab = {
    desc: "Our WebAssembly engine maps and processes your document structures locally.",
    step1: "Your browser reads the PDF directly from your hard drive. It maps every object and page structure into memory.",
    step2: `Our local engine performs the ${actionVerb.toLowerCase()} operation. The work happens entirely on your device CPU.`,
    step3: `The processed file writes straight to your downloads folder. You skip the network wait entirely.`,
    bullet1: "Your files never leave your machine. You meet strict GDPR, HIPAA, and corporate safety standards by default. You keep total control over sensitive business or legal data.",
    bullet2: `Your document maintains exact original quality. Our local engine matches structures perfectly. You will not lose your carefully placed values or formats.`,
    bullet3: `You bypass network speed restrictions entirely. The ${actionVerb.toLowerCase()} process runs as fast as your computer can process it. You never wait in a crowded server queue again.`,
    faq1: "We do not pay for expensive cloud servers to process your files. Your own computer does all the heavy lifting through your web browser. This drops our running costs to nearly zero, so we pass those savings directly to you.",
    faq2: "We have zero access to your files. The entire process happens locally in your browser sandbox. We never upload, store, or view your private documents.",
    faq3: `Our WebAssembly engine maps every detail of massive files without crashing. It handles complex data streams, custom formatting, and hundreds of pages easily. Since you do not upload the file, you skip the size limits of typical cloud converters.`,
    faq4: "You can use this tool on any modern device. It works perfectly on Windows, Mac, iOS, and Android web browsers. You get full local processing power without installing a single app."
  };

  if (dirName.includes('to-pdf')) {
    specificVocab.step2 = `Our local engine converts the source format into exact PDF vectors. The work happens entirely on your device CPU.`;
    specificVocab.bullet2 = `Your document looks exactly like the original. Our local canvas engine matches font styles, complex tables, and absolute vectors perfectly.`;
  } else if (dirName.includes('pdf-to-')) {
    specificVocab.step2 = `Our local engine extracts the document layout into standard editable formats. The extraction happens entirely on your device CPU.`;
  }

  return `  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-display text-white">${toolName} Instantly - 100% Private Browser Processing</h1>
        <p className="text-slate-400 text-lg">
          ${specificVocab.desc} Your files never touch a remote server.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">The Local Processing Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">1. Parse Document Locally</h3>
            <p className="text-sm text-slate-500">${specificVocab.step1}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">2. Native WebAssembly Processing</h3>
            <p className="text-sm text-slate-500">${specificVocab.step2}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">3. Instant Local Save</h3>
            <p className="text-sm text-slate-500">${specificVocab.step3}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Platform Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-3">Feature</th>
                <th className="px-6 py-3 text-primary-400">wordtopdfconverter.online</th>
                <th className="px-6 py-3">Traditional Cloud Converters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-white">Data Isolation</td>
                <td className="px-6 py-4 text-slate-300">100% local browser sandbox. Files never leave your device.</td>
                <td className="px-6 py-4 text-slate-500">Remote server uploads. High risk of data leaks.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-white">File Size Limits</td>
                <td className="px-6 py-4 text-slate-300">Unlimited gigabyte support. Process massive files easily.</td>
                <td className="px-6 py-4 text-slate-500">Premium paywalls cap file sizes at 50MB or less.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-white">Processing Lag</td>
                <td className="px-6 py-4 text-slate-300">Instant local rendering tied to your CPU speed.</td>
                <td className="px-6 py-4 text-slate-500">Slow upload and download network bottlenecks.</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="px-6 py-4 font-bold text-white">Cost</td>
                <td className="px-6 py-4 text-slate-300">100% free with zero daily caps or hidden fees.</td>
                <td className="px-6 py-4 text-slate-500">Gated subscription timers force you to pay later.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Why Professionals Choose Local Tools</h2>
        <ul className="space-y-4 text-slate-400 list-none pl-0">
          <li className="space-y-1">
            <strong className="text-white block">Enterprise-Grade Compliance Built Right In</strong>
            ${specificVocab.bullet1}
          </li>
          <li className="space-y-1">
            <strong className="text-white block">High-Fidelity Document Mapping</strong>
            ${specificVocab.bullet2}
          </li>
          <li className="space-y-1">
            <strong className="text-white block">Pure Local Speed Without Network Limits</strong>
            ${specificVocab.bullet3}
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-white">Why is this ${toolName} service completely free?</h3>
            <p className="text-slate-400 text-sm mt-1">${specificVocab.faq1}</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Do you have any access to my private documents?</h3>
            <p className="text-slate-400 text-sm mt-1">${specificVocab.faq2}</p>
          </div>
          <div>
            <h3 className="font-bold text-white">How do you handle heavily formatted or massive files?</h3>
            <p className="text-slate-400 text-sm mt-1">${specificVocab.faq3}</p>
          </div>
          <div>
            <h3 className="font-bold text-white">Will this tool work on my phone or tablet?</h3>
            <p className="text-slate-400 text-sm mt-1">${specificVocab.faq4}</p>
          </div>
        </div>
      </div>
    </div>
  );

`;
}

function processFileContent(fileContent, newContent) {
  const startKeyword = "const seoContent = (";
  const startIndex = fileContent.indexOf(startKeyword);
  
  if (startIndex !== -1) {
    let openBrackets = 0;
    let endIndex = -1;

    for (let i = startIndex + startKeyword.length - 1; i < fileContent.length; i++) {
      if (fileContent[i] === '(') {
        openBrackets++;
      } else if (fileContent[i] === ')') {
        openBrackets--;
        if (openBrackets === 0) {
          if (fileContent[i+1] === ';') {
            endIndex = i + 2;
          } else {
            endIndex = i + 1;
          }
          break;
        }
      }
    }
    if (endIndex !== -1) {
      return fileContent.substring(0, startIndex) + newContent + fileContent.substring(endIndex);
    }
  }

  // If seoContent doesn't exist, we must inject it right before the 'return (' statement of the component.
  // And we need to add the seoContent prop to ToolLayout.
  
  // Find 'return (' or 'return <ToolLayout'
  let returnMatch = fileContent.match(/return\s*\(\s*<ToolLayout/);
  if (!returnMatch) {
    returnMatch = fileContent.match(/return\s*<ToolLayout/);
  }
  if (!returnMatch) {
    // maybe there's a React Fragment
    returnMatch = fileContent.match(/return\s*\(\s*<>/);
  }
  if (!returnMatch) {
    // Just find 'return' that returns something. Let's look for the last 'return'
    const lastReturnIndex = fileContent.lastIndexOf('return');
    if (lastReturnIndex !== -1) {
      returnMatch = { index: lastReturnIndex, [0]: 'return' };
    }
  }

  if (returnMatch) {
    const injectIndex = returnMatch.index;
    let modified = fileContent.substring(0, injectIndex) + newContent + fileContent.substring(injectIndex);
    
    // Now add seoContent={seoContent} to ToolLayout props if it's not there
    if (modified.includes('<ToolLayout') && !modified.includes('seoContent={seoContent}')) {
      modified = modified.replace(/<ToolLayout/, '<ToolLayout\\n      seoContent={seoContent}');
    }
    return modified;
  }

  return null;
}

async function run() {
  const dirs = fs.readdirSync(APP_DIR);
  let updatedCount = 0;

  for (const dir of dirs) {
    const fullPath = path.join(APP_DIR, dir);
    if (!fs.statSync(fullPath).isDirectory()) continue;
    if (SKIP_DIRS.includes(dir)) continue;

    const pagePath = path.join(fullPath, 'page.jsx');
    if (!fs.existsSync(pagePath)) continue;

    // Skip the ones we already did manually
    if (['word-to-pdf', 'compress-pdf', 'merge-pdf', 'pdf-to-excel', 'pdf-to-word'].includes(dir)) {
      continue;
    }

    let fileContent = fs.readFileSync(pagePath, 'utf-8');
    const toolName = formatToolName(dir);
    const newSeoContent = generateSeoContent(toolName, dir);

    const updatedContent = processFileContent(fileContent, newSeoContent);
    
    if (updatedContent) {
      fs.writeFileSync(pagePath, updatedContent, 'utf-8');
      console.log('Updated: ' + dir);
      updatedCount++;
    } else {
      console.log('Failed to update (could not parse return or seoContent): ' + dir);
    }
  }

  console.log('Successfully updated ' + updatedCount + ' tool pages.');
}

run().catch(console.error);
