// verify-protected-paths.cjs
// Exits non-zero if any protected file is missing or any listed HTML page does not reference the required scripts.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../');
const protectedConfig = require(path.join(root, 'docs/agent/protected-paths.json'));

let failed = false;

function checkFileExists(relPath) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) {
    console.error('Missing protected file:', relPath);
    failed = true;
  }
}

// Check scripts
checkFileExists(protectedConfig.weatherScript);
checkFileExists(protectedConfig.enemyGeneratorScript);

// Check backend endpoints (just file presence)
checkFileExists('server/index.js');

// Check HTML pages reference scripts
const requiredScripts = [
  '/assets/weather.js',
  '/assets/enemy-generator.js'
];

protectedConfig.htmlPagesReferencing.forEach(relPath => {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) {
    console.error('Missing protected HTML page:', relPath);
    failed = true;
    return;
  }
  const content = fs.readFileSync(abs, 'utf8');
  requiredScripts.forEach(script => {
    if (!content.includes(script)) {
      console.error(`Page ${relPath} does not reference ${script}`);
      failed = true;
    }
  });
});

if (failed) {
  process.exit(1);
} else {
  console.log('All protected paths and references are present.');
}
