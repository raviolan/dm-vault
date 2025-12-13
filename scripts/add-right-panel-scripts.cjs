#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

async function walk(dir, root, files) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        const rel = path.relative(root, full);
        if (e.isDirectory()) {
            if (rel.startsWith('assets') || rel.startsWith('backup') || rel.startsWith(path.join('data', 'backup'))) continue;
            await walk(full, root, files);
        } else {
            if (full.endsWith('.html')) files.push(full);
        }
    }
}

async function findHtmlFiles(root) {
    const files = [];
    await walk(root, root, files);
    return files;
}

async function processFile(file) {
    try {
        let txt = await fs.readFile(file, 'utf8');
        if (!txt.includes('Right panel injected by /assets/right-panel-loader.js')) return;
        if (txt.includes('/assets/right-panel-loader.js') || txt.includes('/assets/right-panel.js')) return;
        const insert = '\n    <script src="/assets/right-panel-loader.js"></script>\n    <script src="/assets/right-panel.js"></script>\n';
        // Insert before closing </body>
        if (txt.includes('</body>')) {
            txt = txt.replace(/<\/body>/i, insert + '\n</body>');
            await fs.copyFile(file, file + '.bak2');
            await fs.writeFile(file, txt, 'utf8');
            console.log('Inserted scripts into', file);
        }
    } catch (e) {
        console.error('Error', file, e.message);
    }
}

(async function () {
    const root = process.cwd();
    const files = await findHtmlFiles(root);
    for (const f of files) await processFile(f);
    console.log('Done. Backups written with .bak2 suffix for modified files.');
})();
