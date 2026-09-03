const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/Users/apple/Tecveq Projects/Cast war/frontend/**/*.tsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('http://localhost:8000')) {
        changed = true;
        
        // Ensure imports are present
        let importStatement = "import { API_URL, BASE_URL } from '@/lib/api';\n";
        
        // If file doesn't have the import, add it after the first line (or other imports)
        if (!content.includes("from '@/lib/api'")) {
            // Find the last import
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLine = content.indexOf('\n', lastImportIndex);
                content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
            } else {
                // If 'use client' is first
                if (content.includes("'use client'") || content.includes('"use client"')) {
                    const endOfLine = content.indexOf('\n');
                    content = content.slice(0, endOfLine + 1) + '\n' + importStatement + content.slice(endOfLine + 1);
                } else {
                    content = importStatement + content;
                }
            }
        } else {
            // Update existing import to include BASE_URL and API_URL if needed
            if (!content.includes('API_URL')) {
                content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]@\/lib\/api['"]/, (match, p1) => {
                    return `import { ${p1}, API_URL, BASE_URL } from '@/lib/api'`;
                });
            } else if (!content.includes('BASE_URL')) {
                content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]@\/lib\/api['"]/, (match, p1) => {
                    return `import { ${p1}, BASE_URL } from '@/lib/api'`;
                });
            }
        }

        // Replacements
        content = content.replace(/'http:\/\/localhost:8000\/api\/v1([^']*)'/g, '`${API_URL}$1`');
        content = content.replace(/"http:\/\/localhost:8000\/api\/v1([^"]*)"/g, '`${API_URL}$1`');
        content = content.replace(/`http:\/\/localhost:8000\/api\/v1([^`]*)`/g, '`${API_URL}$1`');
        
        content = content.replace(/'http:\/\/localhost:8000([^']*)'/g, '`${BASE_URL}$1`');
        content = content.replace(/"http:\/\/localhost:8000([^"]*)"/g, '`${BASE_URL}$1`');
        content = content.replace(/`http:\/\/localhost:8000([^`]*)`/g, '`${BASE_URL}$1`');

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
