#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function walk(dir) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of list) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (p.includes('/assets/partials') || p.includes('/assets') || p.includes('/backup')) continue;
      walk(p);
    } else if (e.isFile() && p.endsWith('.html')) {
      processFile(p);
    }
  }
}
function processFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  // Remove header + modals block up to the compact weather strip comment
  s = s.replace(/<!-- Header Partial:[\s\S]*?<!-- Compact weather strip:/g, '<div class="top"></div>\n        <!-- Compact weather strip:');
  // Replace left aside blocks
  s = s.replace(/<aside class="left">[\s\S]*?<\/aside>/g, '<aside class="left"></aside>');
  // Replace right aside blocks
  s = s.replace(/<aside class="right">[\s\S]*?<\/aside>/g, '<aside class="right"></aside>');
  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('Updated', path.relative(root, file));
  }
}
walk(root);
console.log('Done');
