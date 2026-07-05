const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'app');
const dirs = fs.readdirSync(SRC_DIR).filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory());

const usingAPI = [];
const notUsingAPI = [];

for (const dir of dirs) {
  const pagePath = path.join(SRC_DIR, dir, 'page.jsx');
  if (!fs.existsSync(pagePath)) continue;

  const content = fs.readFileSync(pagePath, 'utf8');
  if (content.includes("fetch('/api/convert'") || content.includes('ILovePDF')) {
    usingAPI.push(dir);
  } else {
    notUsingAPI.push(dir);
  }
}

console.log(`Tools using API (${usingAPI.length}):`);
console.log(usingAPI.join(', '));
console.log(`\nTools NOT using API (${notUsingAPI.length}):`);
console.log(notUsingAPI.join(', '));
