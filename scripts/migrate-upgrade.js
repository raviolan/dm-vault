#!/usr/bin/env node
/*
 * Non-destructive upgrade/migration helper
 * - Creates a backup of `data/` before attempting simple transformations
 * - Example usage: node scripts/migrate-upgrade.js --dry-run
 * - By default does a dry-run; use --confirm to apply changes.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

function parseArgs() { const args = process.argv.slice(2); return { confirm: args.includes('--confirm'), dryRun: args.includes('--dry-run') || !args.includes('--confirm') }; }
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function nowStamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }

function backupData(dryRun) {
  const backupName = `data-backup-${nowStamp()}`;
  const backupPath = path.join(path.dirname(DATA_DIR), backupName);
  if (dryRun) { console.log(`[dry] would copy ${DATA_DIR} -> ${backupPath}`); return backupPath; }
  ensureDir(backupPath);
  // simple copy
  copyRecursiveSync(DATA_DIR, backupPath);
  console.log(`backup created at ${backupPath}`);
  return backupPath;
}

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function simpleMigration(dryRun) {
  console.log('running simple migration checks...');
  // Example: if data has top-level files that should be inside folders, move them.
  // This is a no-op placeholder — extend with project-specific logic when needed.
  return [];
}

async function main() {
  const { confirm, dryRun } = parseArgs();
  if (!fs.existsSync(DATA_DIR)) { console.error('data/ not found; nothing to migrate.'); return; }
  console.log('migrate-upgrade', dryRun ? '(dry-run)' : '(confirm)');
  backupData(dryRun);
  const actions = simpleMigration(dryRun);
  if (actions.length === 0) console.log('No migration actions detected.');
  if (!dryRun && confirm) console.log('Migrations applied.');
  if (dryRun) console.log('Dry-run complete; re-run with --confirm to apply.');
}

main().catch(err => { console.error(err); process.exit(1); });
