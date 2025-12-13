#!/usr/bin/env node
/*
 * Safe migration script to move user content into `data/`.
 * Usage:
 *   node scripts/migrate-user-content-to-data.js --dry-run      (default)
 *   node scripts/migrate-user-content-to-data.js --confirm      (actually move files)
 *
 * The script will:
 *  - detect common content folders and move them into `data/<folder>`
 *  - create a placeholder README in the original location explaining the move
 *  - refuse to run if `data/` already exists and is non-empty unless `--confirm` is used
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

const CANDIDATE_FOLDERS = [
    '00_Campaign', '01_Arcs', '02_World', '03_PCs', '04_NPCs', '05_Tools & Tables', '99_Attachments', 'web'
];

function parseArgs() {
    const args = process.argv.slice(2);
    return {
        confirm: args.includes('--confirm'),
        dryRun: args.includes('--dry-run') || !args.includes('--confirm')
    };
}

function exists(p) { return fs.existsSync(p); }

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function isDirectory(p) {
    try { return fs.statSync(p).isDirectory(); } catch (e) { return false; }
}

function moveFolder(src, dest, dryRun) {
    if (dryRun) return console.log(`[dry] would move ${src} -> ${dest}`);
    fs.renameSync(src, dest);
    console.log(`moved ${src} -> ${dest}`);
}

function writePlaceholder(originalPath, folderName, dryRun) {
    const msg = `This folder's content was moved to the local data/ directory to keep user data separate and out of the repository.\n\nTo restore, copy the contents of data/${folderName} back into this folder.\n`;
    const file = path.join(originalPath, 'README.MOVED_TO_DATA.md');
    if (dryRun) return console.log(`[dry] would write placeholder in ${originalPath}`);
    fs.writeFileSync(file, msg, 'utf8');
}

async function main() {
    const { confirm, dryRun } = parseArgs();
    console.log('migrate-user-content-to-data', dryRun ? '(dry-run)' : '(confirm)');

    // Check data dir
    if (exists(DATA_DIR)) {
        const entries = fs.readdirSync(DATA_DIR);
        if (entries.length > 0 && !confirm) {
            console.error('data/ already exists and is non-empty. Use --confirm to proceed.');
            process.exit(1);
        }
    }

    ensureDir(DATA_DIR);

    for (const folder of CANDIDATE_FOLDERS) {
        const origPath = path.join(ROOT, folder);
        if (!isDirectory(origPath)) continue;
        const dest = path.join(DATA_DIR, folder);
        if (exists(dest)) {
            console.log(`data/${folder} already exists — skipping move for ${folder}`);
            continue;
        }

        moveFolder(origPath, dest, dryRun);
        // recreate an empty folder with placeholder so structure stays in repo
        if (!dryRun) {
            ensureDir(origPath);
            writePlaceholder(origPath, folder, dryRun);
        }
    }

    console.log('Done. Verify the `data/` directory contains your moved content.');
    if (dryRun) console.log('Dry-run complete; re-run with --confirm to perform the moves.');
}

main().catch(err => { console.error(err); process.exit(1); });
