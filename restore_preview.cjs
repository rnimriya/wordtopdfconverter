const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');

const SRC_DIR = path.join(__dirname, 'src', 'app');

function restorePreview(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      restorePreview(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix broken preview lines
      if (content.includes('preview={<PDFPreview')) {
        content = content.replace(/(preview={<PDFPreview[^>]*)(?!\/>\})\s*\n/g, '$1 />}\n');
      }
      
      // Fix rtf-to-pdf: Missing semicolon (78:3) -> wait, what happened in rtf-to-pdf?
      // Fix pdf-scanner: Expected corresponding JSX closing tag for <>. (261:38)
      // Fix text-to-pdf: Expected corresponding JSX closing tag for <>. (331:10)

      fs.writeFileSync(fullPath, content);
    }
  }
}

restorePreview(SRC_DIR);
