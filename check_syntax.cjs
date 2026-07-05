const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');

const SRC_DIR = path.join(__dirname, 'src', 'app');
let hasErrors = false;

function checkSyntax(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkSyntax(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      try {
        babel.parse(content, {
          sourceType: 'module',
          plugins: ['jsx']
        });
      } catch (err) {
        console.error(`Syntax Error in ${fullPath}:`, err.message);
        hasErrors = true;
      }
    }
  }
}

checkSyntax(SRC_DIR);
if (!hasErrors) console.log("All JSX files have valid syntax!");
