import fs from 'fs';

const files = [
  'src/app/edit-pdf/page.jsx',
  'src/app/pdf-annotator/page.jsx',
  'src/app/pdf-form-filler/page.jsx',
  'src/app/redact-pdf/page.jsx',
  'src/app/sign-pdf/page.jsx',
  'src/app/request-signatures/page.jsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace("replace(/\\\\.[^/.]+$/, '')", "replace(/\\.[^/.]+$/, '')");
  fs.writeFileSync(f, content);
});
console.log("Fixed regex");
