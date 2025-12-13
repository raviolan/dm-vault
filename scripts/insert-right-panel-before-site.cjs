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
        // Only act on files that were converted (contain our marker) and that include site.js
        if (!txt.includes('Right panel injected by /assets/right-panel-loader.js')) return;
        if (!txt.includes('/assets/site.js')) return;
        // If scripts already present before site.js, skip
        const beforeSite = '\n    <script src="/assets/right-panel-loader.js"></script>\n    <script src="/assets/right-panel.js"></script>\n    <script src="/assets/site.js"';
        if (txt.includes(beforeSite)) return;
        // Insert right-panel scripts immediately before the first occurrence of site.js script tag
        txt = txt.replace(/\n\s*<script src=\"\/assets\/site\.js[^>]*><\/script>/i, '\n    <script src="/assets/right-panel-loader.js?v=1765643025396"></script>\n    <script src="/assets/right-panel.js?v=1765643025396"></script>\n    <script src="/assets/site.js?v=1765643025396"></script>');
        await fs.copyFile(file, file + '.bak3');
        await fs.writeFile(file, txt, 'utf8');
        console.log('Patched:', file);
    } catch (e) {
        console.error('Error', file, e.message);
    }
}

(async function () {
    const root = process.cwd();
    const files = await findHtmlFiles(root);
    for (const f of files) await processFile(f);
    console.log('Done. Backups written with .bak3 suffix for modified files.');
})();
