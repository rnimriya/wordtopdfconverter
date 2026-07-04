const fs = require('fs');
const path = require('path');
const APP_DIR = path.join(__dirname, '../src/app');

function run() {
  const dirs = fs.readdirSync(APP_DIR);
  let fixedCount = 0;

  for (const dir of dirs) {
    const fullPath = path.join(APP_DIR, dir);
    if (!fs.statSync(fullPath).isDirectory()) continue;

    const pagePath = path.join(fullPath, 'page.jsx');
    if (!fs.existsSync(pagePath)) continue;

    let content = fs.readFileSync(pagePath, 'utf-8');
    
    // Check if it has the literal '\n' string followed by spaces and seoContent
    if (content.includes('<ToolLayout\\n      seoContent={seoContent}')) {
      content = content.replace('<ToolLayout\\n      seoContent={seoContent}', '<ToolLayout\n      seoContent={seoContent}');
      fs.writeFileSync(pagePath, content, 'utf-8');
      console.log('Fixed:', dir);
      fixedCount++;
    }
  }
  console.log('Total fixed:', fixedCount);
}

run();
