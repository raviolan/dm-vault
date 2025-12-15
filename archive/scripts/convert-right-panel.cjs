#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

function findHtmlFiles(root) {
    return new Promise((resolve, reject) => {
        glob('**/*.html', { cwd: root, nodir: true, ignore: ['assets/**', 'backup/**', 'data/backup/**'] }, (err, files) => {
            if (err) return reject(err);
            resolve(files.map(f => path.join(root, f)));
        });
    });
}

async function processFile(file) {
    try {
        const txt = await fs.readFile(file, 'utf8');
        let out = txt;
        const rightRegex = /<aside\s+class=["']right["'][\s\S]*?<\/aside>/gi;
        const scriptRegex = /<script[^>]*src=["']\/assets\/right-panel\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi;
        let changed = false;
        if (rightRegex.test(out)) {
            out = out.replace(rightRegex, '<aside class="right"><!-- Right panel injected by /assets/right-panel-loader.js --></aside>');
            changed = true;
        }
        if (scriptRegex.test(out)) {
            out = out.replace(scriptRegex, '');
            changed = true;
        }
        if (changed) {
            await fs.copyFile(file, file + '.bak');
            await fs.writeFile(file, out, 'utf8');
            console.log('Updated:', file);
        }
    } catch (e) {
        console.error('Error processing', file, e.message);
    }
}

(async function () {
    const root = process.cwd();
    const files = await findHtmlFiles(root);
    for (const f of files) await processFile(f);
    console.log('Done. Backups written with .bak suffix next to modified files.');
})();
