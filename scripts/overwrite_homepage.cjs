const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../src/app/word-to-pdf/page.jsx');
const targetPath = path.join(__dirname, '../src/app/page.jsx');

let content = fs.readFileSync(sourcePath, 'utf8');

// Adjust imports for being one directory level higher
content = content.replace(/import ToolLayout from '\.\.\/\.\.\/components\/ToolLayout\.jsx';/g, "import ToolLayout from '../components/ToolLayout.jsx';");
content = content.replace(/import \{ convertDocxToHtml \} from '\.\.\/\.\.\/utils\/docxParser\.js';/g, "import { convertDocxToHtml } from '../utils/docxParser.js';");

// Change function name from WordToPdf to Home
content = content.replace(/function WordToPdf\(\)/g, "function Home()");
content = content.replace(/export default WordToPdf;/g, "export default Home;");

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Homepage overwritten with WordToPdf converter!');
