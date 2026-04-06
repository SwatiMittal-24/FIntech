const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const replacements = [
  // Backgrounds
  { regex: /background:\s*["']#fff(fff)?["']/gi, replace: 'background: "var(--bg-card)"' },
  { regex: /background:\s*["']#(F8FAFC|FAFBFC|F1F5F9)["']/gi, replace: 'background: "var(--bg-muted)"' },
  { regex: /background:\s*["']#0F172A["']/gi, replace: 'background: "var(--bg-app)"' },

  // Colors
  { regex: /color:\s*["']#0F172A["']/gi, replace: 'color: "var(--text-900)"' },
  { regex: /color:\s*["']#1E293B["']/gi, replace: 'color: "var(--text-700)"' },
  { regex: /color:\s*["']#475569["']/gi, replace: 'color: "var(--text-500)"' },
  { regex: /color:\s*["']#64748B["']/gi, replace: 'color: "var(--text-400)"' },
  { regex: /color:\s*["']#94A3B8["']/gi, replace: 'color: "var(--text-300)"' },

  // Borders
  { regex: /border:\s*["'](1|1\.5)px solid #E2E8F0["']/gi, replace: 'border: "$1px solid var(--border)"' },
  { regex: /borderBottom:\s*["'](1|1\.5)px solid #(E2E8F0|F1F5F9|F8FAFC)["']/gi, replace: 'borderBottom: "$1px solid var(--border)"' },
  { regex: /borderTop:\s*["'](1|1\.5)px solid #(E2E8F0|F1F5F9|F8FAFC)["']/gi, replace: 'borderTop: "$1px solid var(--border)"' },
  { regex: /borderRight:\s*["'](1|1\.5)px solid #(E2E8F0|F1F5F9|F8FAFC)["']/gi, replace: 'borderRight: "$1px solid var(--border)"' },
  { regex: /borderColor:\s*["']#E2E8F0["']/gi, replace: 'borderColor: "var(--border)"' },
  
  // Custom Hover/Focus overrides that break
  { regex: /\.style\.borderColor\s*=\s*["']#E2E8F0["']/g, replace: '.style.borderColor = "var(--border)"' },
  { regex: /\.style\.background\s*=\s*["']#(F8FAFF|F8FAFC|transparent)["']/g, replace: '.style.background = "var(--bg-muted)"' },
  { regex: /\.style\.color\s*=\s*["']#475569["']/g, replace: '.style.color = "var(--text-500)"' },

  // Box Shadows
  { regex: /boxShadow:\s*["']0 1px 4px rgba\(0,0,0,0\.0[56]\)["']/g, replace: 'boxShadow: "var(--shadow-sm)"' },
  { regex: /boxShadow:\s*["']0 8px 24px rgba\(0,0,0,0\.10\)["']/g, replace: 'boxShadow: "var(--shadow-lg)"' },
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
console.log("Color replacement done.");
