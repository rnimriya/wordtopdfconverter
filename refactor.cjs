const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'app');

const TASK_MAP = {
  'word-to-pdf': 'officepdf',
  'excel-to-pdf': 'officepdf',
  'ppt-to-pdf': 'officepdf',
  'jpg-to-pdf': 'imagepdf',
  'pdf-to-jpg': 'pdfjpg',
  'pdf-to-png': 'pdfjpg',
  'merge-pdf': 'merge',
  'split-pdf': 'split',
  'compress-pdf': 'compress',
  'rotate-pdf': 'rotate',
  'watermark-pdf': 'watermark',
  'protect-pdf': 'protect',
  'unlock-pdf': 'unlock',
  'repair-pdf': 'repair',
  'pdf-to-pdfa': 'pdfa'
};

const dirs = fs.readdirSync(SRC_DIR).filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory());

for (const dir of dirs) {
  if (!TASK_MAP[dir]) continue;
  
  const pagePath = path.join(SRC_DIR, dir, 'page.jsx');
  if (!fs.existsSync(pagePath)) continue;

  let content = fs.readFileSync(pagePath, 'utf8');

  // Skip if already has ILovePDF fetch
  if (content.includes("fetch('/api/convert'")) {
    console.log('Skipping (already refactored)', dir);
    continue;
  }

  // Identify the file variable name: is it 'file' or 'files'?
  const hasFilesArray = content.includes('const [files, setFiles]');
  const fileVar = hasFilesArray ? 'files' : 'file';

  // Identify the function name: handleConvert, handleMerge, etc.
  const fnMatch = content.match(/const (handle[a-zA-Z]+) = async \(\) => \{/);
  if (!fnMatch) {
    console.log('Could not find handle fn in', dir);
    continue;
  }
  const fnName = fnMatch[1];

  const startIndex = content.indexOf(`const ${fnName} = async () => {`);
  if (startIndex === -1) continue;
  
  let braceCount = 0;
  let endIndex = -1;
  let started = false;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      started = true;
    } else if (content[i] === '}') {
      braceCount--;
    }
    
    if (started && braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    console.log('Could not find end of fn in', dir);
    continue;
  }

  const newFn = `const ${fnName} = async () => {
    if (${hasFilesArray ? 'files.length === 0' : '!file'}) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const formData = new FormData();
      ${hasFilesArray ? `files.forEach(f => formData.append('file', f));` : `formData.append('file', file);` }
      formData.append('task', '${TASK_MAP[dir]}');

      setProgress(30);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || \`Server responded with \${response.status}\`);
      }

      setProgress(80);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let downloadName = 'processed-document.pdf';
      ${hasFilesArray 
        ? `downloadName = \`${TASK_MAP[dir]}-result-\${Date.now()}.pdf\`;`
        : `downloadName = \`\${file.name.replace(/\\.[^/.]+$/, '')}-${TASK_MAP[dir]}.pdf\`;`
      }
      
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
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Error processing document: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  }`;

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex + 1);
  
  let newContent = before + newFn + after;

  newContent = newContent.replace(/<span>.*?Engine.*?<\/span>/gi, '<span>ILovePDF API Processing Engine</span>');
  newContent = newContent.replace(/<p className="text-\[11px\][^>]*>.*?<\/p>/gs, '<p className="text-[11px] text-slate-500 leading-relaxed">This converter securely sends your file to the ILovePDF API for perfect processing. Your data is safely handled and the output is guaranteed to maintain precision.</p>');

  newContent = newContent.replace(/preview=\{[\s\S]*?\}/g, '');

  fs.writeFileSync(pagePath, newContent);
  console.log('Refactored', dir);
}
