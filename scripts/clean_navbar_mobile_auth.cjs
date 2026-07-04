const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/Navbar.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The mobile menu auth block starts with {/* Mobile Auth */} or is below {/* Mobile Nav Links */}
// Actually, let's just do a regex that matches from {status === 'loading' ? ( down to the end of that ternary block, which ends with )} right before </div></div>}
const mobileAuthRegex = /\{status === 'loading' \? \([\s\S]*?\}\)/;
content = content.replace(mobileAuthRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Navbar Mobile Auth removed!');
