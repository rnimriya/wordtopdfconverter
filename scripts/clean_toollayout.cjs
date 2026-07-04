const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ToolLayout.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove openFaq state
content = content.replace(/const \[openFaq, setOpenFaq\] = useState\(null\);\r?\n/, '');

// 2. Remove getFaqs function entirely (using a robust regex)
// We match from "const getFaqs =" down to "const getRelatedTools ="
content = content.replace(/const getFaqs = \([^)]*\) => \{[\s\S]*?\};\r?\n\r?\n\s*const getRelatedTools =/m, 'const getRelatedTools =');

// 3. Remove const faqs = getFaqs(title);
content = content.replace(/const faqs = getFaqs\(title\);\r?\n\s*/, '');

// 4. Remove schema injection logic inside useEffect
const schemaRegex = /\/\/ 2\. Inject JSON-LD FAQ schema[\s\S]*?const script = document\.createElement\('script'\);[\s\S]*?document\.head\.appendChild\(script\);\r?\n/m;
content = content.replace(schemaRegex, '');

// 5. Remove the return cleanup for the script inside useEffect
const scriptCleanupRegex = /const injectedScript = document\.getElementById\(script\.id\);\r?\n\s*if \(injectedScript\) \{\r?\n\s*document\.head\.removeChild\(injectedScript\);\r?\n\s*\}/m;
content = content.replace(scriptCleanupRegex, '');

// 6. Remove Section 2 and Section 3 JSX blocks
const sectionsRegex = /\{\/\* Section 2: Why Choose Word To PDF Convertor Benefits Grid \*\/\}[\s\S]*?\{\/\* Section 4: Related Tools \(Internal Linking\) \*\/\}/m;
content = content.replace(sectionsRegex, '{/* Section 4: Related Tools (Internal Linking) */}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('ToolLayout.jsx cleaned successfully!');
