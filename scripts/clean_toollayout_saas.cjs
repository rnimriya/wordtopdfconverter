const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ToolLayout.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove props from signature
// Current: function ToolLayout({ title, description, file, onFileSelect, onClear, children, isExecuting, progress, errorMessage, successMessage, handleExecuteClick, controls, accept = ".pdf", multiple = false, preview, showUpgradeModal, setShowUpgradeModal, isProOnly = false, modalReason, maxFileSizeMB = 250, seoContent })
content = content.replace(/showUpgradeModal,\s*setShowUpgradeModal,\s*isProOnly\s*=\s*false,\s*modalReason,\s*maxFileSizeMB\s*=\s*250,\s*/g, '');

// 2. Remove "Pro Only" pill block
const proOnlyBlockRegex = /\{isProOnly && \([\s\S]*?Pro Only\s*<\/span>\s*\)\}/;
content = content.replace(proOnlyBlockRegex, '');

// 3. Remove SaaS Upgrade/Auth Modal block
// It starts with {/* SaaS Upgrade/Auth Modal */} and goes to the end of the file before </div>
const modalBlockRegex = /\{\/\* SaaS Upgrade\/Auth Modal \*\/\}\s*\{showUpgradeModal && \([\s\S]*?\)\}/;
content = content.replace(modalBlockRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('ToolLayout SaaS logic removed!');
