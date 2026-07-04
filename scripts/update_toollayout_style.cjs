const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ToolLayout.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace Tool Header
const headerRegex = /\{\/\* Tool Header \(Compact & Light Theme\) \*\/\}[\s\S]*?<\/div>\r?\n\r?\n\s*\{\/\* Main Workspace \*\/\}/m;

const newHeader = `{/* Tool Header (FreeConvert Aesthetic) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-10 pb-6">
        <h1 className="text-[42px] leading-tight font-extrabold text-[#282f3a] flex flex-col sm:flex-row items-center justify-center gap-3">
          <span>{title}</span>
          {isProOnly && (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm select-none">
              Pro Only
            </span>
          )}
        </h1>
        <p className="text-[18px] text-slate-600 font-medium">
          {description}
        </p>
      </div>

      {/* Main Workspace */}`;

content = content.replace(headerRegex, newHeader);

// 2. Replace Primary Button in Sidebar
const buttonRegex = /\{\/\* Primary Button \*\/\}[\s\S]*?<\/button>/m;

const newButton = `{/* Primary Button */}
                <button
                  onClick={handleExecuteClick}
                  disabled={isExecuting}
                  className="w-full bg-[#727cf5] hover:bg-[#656ee0] text-white font-bold text-[16px] py-4 px-6 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
                >
                  {isExecuting ? 'Processing...' : \`Convert & Download\`}
                </button>`;

content = content.replace(buttonRegex, newButton);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ToolLayout updated for FreeConvert aesthetic!');
