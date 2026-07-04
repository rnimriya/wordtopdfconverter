const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/Navbar.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove useSession import
content = content.replace(/import \{ useSession, signOut \} from 'next-auth\/react';\r?\n/, '');

// 2. Remove session hooks
content = content.replace(/const \{ data: session, status \} = useSession\(\);\r?\n/, '');

// 3. Remove Pricing and Auth buttons
const authBlockRegex = /\{\/\* Pricing \*\/\}[\s\S]*?\{\/\* Hamburger Mobile Menu \*\/\}/m;
const replacement = `{/* Hamburger Mobile Menu */}`;
content = content.replace(authBlockRegex, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Navbar Auth removed!');
