#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'assets', 'scripts', 'backup', 'data', 'archive', '__MACOSX']);
const HTML_EXT = '.html';
const SCRIPT_SRC_REGEX = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
const TEMPLATE_MARKER_REGEX = /\{\{#if|\{\{\/if\}/g;

let htmlFilesScanned = 0;
let filesWithDuplicates = 0;
let filesWithTemplateMarkers = 0;
const duplicateReports = [];
const templateMarkerReports = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) {
        scanDir(path.join(dir, entry.name));
      }
    } else if (entry.isFile() && entry.name.endsWith(HTML_EXT)) {
      processHtmlFile(path.join(dir, entry.name));
    }
  }
}

function processHtmlFile(filePath) {
  htmlFilesScanned++;
  const content = fs.readFileSync(filePath, 'utf8');
  // Collect <script src="...">
  const srcCounts = {};
  let match;
  while ((match = SCRIPT_SRC_REGEX.exec(content)) !== null) {
    const src = match[1];
    srcCounts[src] = (srcCounts[src] || 0) + 1;
  }
  const duplicates = Object.entries(srcCounts).filter(([src, count]) => count > 1);
  if (duplicates.length > 0) {
    filesWithDuplicates++;
    duplicateReports.push({ filePath, duplicates });
  }
  // Check for template markers
  const templateMatches = content.match(TEMPLATE_MARKER_REGEX);
  if (templateMatches) {
    filesWithTemplateMarkers++;
    templateMarkerReports.push({ filePath, markers: templateMatches });
  }
}

// Start scan from repo root
scanDir(path.resolve(__dirname, '../../'));

// Reporting
console.log('--- HTML Script Audit Report ---');
console.log(`HTML files scanned: ${htmlFilesScanned}`);
if (duplicateReports.length > 0) {
  console.log(`\nFiles with duplicate <script src> tags:`);
  for (const { filePath, duplicates } of duplicateReports) {
    console.log(`- ${filePath}`);
    for (const [src, count] of duplicates) {
      console.log(`    src: "${src}" (count: ${count})`);
    }
  }
}
if (templateMarkerReports.length > 0) {
  console.log(`\nFiles containing template markers ({{#if or {{/if}}):`);
  for (const { filePath, markers } of templateMarkerReports) {
    console.log(`- ${filePath} (found: ${markers.join(', ')})`);
  }
}
console.log('\n--- Summary ---');
console.log(`HTML files scanned: ${htmlFilesScanned}`);
console.log(`Files with duplicate scripts: ${filesWithDuplicates}`);
console.log(`Files with template markers: ${filesWithTemplateMarkers}`);

if (filesWithDuplicates === 0 && filesWithTemplateMarkers === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
