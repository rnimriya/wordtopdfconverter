const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'app');

function restoreSyntax(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      restoreSyntax(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Specifically fix known broken lines from the regex accident
      content = content.replace(/<Check className="h-3 w-3"/g, '<Check className="h-3 w-3" />}');
      content = content.replace(/<Eye className="h-4\.5 w-4\.5"/g, '<Eye className="h-4.5 w-4.5" />}');
      content = content.replace(/<Send className="h-4\.5 w-4\.5"/g, '<Send className="h-4.5 w-4.5" />}');
      content = content.replace(/<Copy className="h-4 w-4 text-primary-500"/g, '<Copy className="h-4 w-4 text-primary-500" />}');
      content = content.replace(/<ImageDown className="h-4 w-4"/g, '<ImageDown className="h-4 w-4" />}');
      
      // Also fix the multiline `\n\s* />}` breakage which resulted in `\n\s*` instead of `\n\s*/>}` ... wait, if I did `replace(/\n\s*\/>\}/g, '')`, it replaced the whole newline and whitespace AND `/>}`. 
      // This means the code like:
      //       errorMessage={errorMessage}
      //       />} 
      // Became:
      //       errorMessage={errorMessage}    />
      // Which is actually valid JSX! `<ToolLayout ... errorMessage={errorMessage} />`
      // Wait, is it valid? Let's check `repair-pdf` diff.

      fs.writeFileSync(fullPath, content);
    }
  }
}

restoreSyntax(SRC_DIR);
