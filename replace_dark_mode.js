const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const replacements = [
  // Backgrounds
  { regex: /background:\s*isDark\s*\?\s*["']#0F172A["']\s*:\s*["']#ffffff["']/g, replace: 'background: "var(--bg-app)"' },
  { regex: /background:\s*isDark\s*\?\s*["']#0F172A["']\s*:\s*["']#FAFBFC["']/g, replace: 'background: "var(--bg-app)"' },
  { regex: /background:\s*isDark\s*\?\s*["']#1E293B["']\s*:\s*["']#fff(fff)?["']/g, replace: 'background: "var(--bg-card)"' },
  { regex: /background:\s*isDark\s*\?\s*["']#1E293B["']\s*:\s*["']#F8FAFC["']/g, replace: 'background: "var(--bg-muted)"' },
  { regex: /background:\s*isDark\s*\?\s*["']#334155["']\s*:\s*["']#F1F5F9["']/g, replace: 'background: "var(--bg-muted)"' },
  
  // Colors
  { regex: /color:\s*isDark\s*\?\s*["']#F1F5F9["']\s*:\s*["']#0F172A["']/g, replace: 'color: "var(--text-900)"' },
  { regex: /color:\s*isDark\s*\?\s*["']#94A3B8["']\s*:\s*["']#64748B["']/g, replace: 'color: "var(--text-400)"' },
  { regex: /color:\s*isDark\s*\?\s*["']#64748B["']\s*:\s*["']#94A3B8["']/g, replace: 'color: "var(--text-300)"' },
  { regex: /color:\s*isDark\s*\?\s*["']#CBD5E1["']\s*:\s*["']#475569["']/g, replace: 'color: "var(--text-500)"' },
  { regex: /color:\s*isDark\s*\?\s*["']#E2E8F0["']\s*:\s*["']#334155["']/g, replace: 'color: "var(--text-700)"' },

  // Borders
  { regex: /border:\s*`1(px)? solid \$\{isDark \? ["']#334155["'] : ["']#E2E8F0["']\}`/g, replace: 'border: "1px solid var(--border)"' },
  { regex: /border:\s*`1.5(px)? solid \$\{isDark \? ["']#334155["'] : ["']#E2E8F0["']\}`/g, replace: 'border: "1.5px solid var(--border)"' },
  { regex: /borderBottom:\s*`1(px)? solid \$\{isDark \? ["']#1E293B["'] : ["']#E2E8F0["']\}`/g, replace: 'borderBottom: "1px solid var(--border)"' },
  { regex: /borderBottom:\s*`1(px)? solid \$\{isDark \? ["']#334155["'] : ["']#F1F5F9["']\}`/g, replace: 'borderBottom: "1px solid var(--border)"' },
  { regex: /borderRight:\s*`1(px)? solid \$\{isDark \? ["']#1E293B["'] : ["']#E2E8F0["']\}`/g, replace: 'borderRight: "1px solid var(--border)"' },
  { regex: /borderColor:\s*isDark\s*\?\s*["']#334155["']\s*:\s*["']#E2E8F0["']/g, replace: 'borderColor: "var(--border)"' },

  // Box Shadows
  { regex: /boxShadow:\s*isDark\s*\?\s*["']0 1px 4px rgba\(0,0,0,0\.3\)["']\s*:\s*["']0 1px 4px rgba\(0,0,0,0\.06\)["']/g, replace: 'boxShadow: "var(--shadow-sm)"' },
  { regex: /boxShadow:\s*isDark\s*\?\s*["']0 12px 28px rgba\(0,0,0,0\.5\)["']\s*:\s*["']0 12px 28px rgba\(0,0,0,0\.11\)["']/g, replace: 'boxShadow: "var(--shadow-lg)"' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const {regex, replace} of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir(srcDir);
console.log("Done");
