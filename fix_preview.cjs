const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'app');

function fixSyntaxErrors(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixSyntaxErrors(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(' />}')) {
        // Find instances where there's just whitespace and `/>}` and remove the ` />}`
        // Wait, if it's like:
        //       errorMessage={errorMessage}
        //        />}
        //     />
        // Then we just want to remove the ` />}` line or replace ` />}` with nothing if it's isolated.
        content = content.replace(/\n\s*\/>\}/g, '');
        // Also if it's on the same line:
        content = content.replace(/ \/>\}/g, '');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

fixSyntaxErrors(SRC_DIR);
