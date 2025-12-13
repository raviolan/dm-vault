#!/usr/bin/env node
/*
 * First-run seeding script
 * - If `data/` is missing or empty, create minimal directory structure and sample files.
 * - Safe: will not overwrite existing files.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

const BASE_FOLDERS = [
    '00_Campaign', '01_Arcs', '02_World', '03_PCs', '04_NPCs', '05_Tools & Tables', '99_Attachments'
];

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function writeIfMissing(filePath, contents) {
    if (fs.existsSync(filePath)) return false;
    fs.writeFileSync(filePath, contents, 'utf8');
    return true;
}

function isEmptyDir(dir) {
    if (!fs.existsSync(dir)) return true;
    const entries = fs.readdirSync(dir);
    return entries.length === 0;
}

function main() {
    ensureDir(DATA_DIR);
    if (!isEmptyDir(DATA_DIR)) {
        console.log('data/ exists and is not empty — skipping seed.');
        return;
    }

    for (const f of BASE_FOLDERS) {
        const target = path.join(DATA_DIR, f);
        ensureDir(target);
        const sampleFile = path.join(target, '.placeholder');
        writeIfMissing(sampleFile, `This folder is for user content: ${f}\nCreate your files here.`);
        console.log(`created ${target}`);
    }

    // write a version marker
    const marker = path.join(DATA_DIR, '.dmvault_version');
    writeIfMissing(marker, '1');
    console.log('Seeded data/ with base folders.');
}

main();
