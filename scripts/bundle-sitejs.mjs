// Simple esbuild bundler for site.js
import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['assets/site/entry.js'],
  bundle: true,
  outfile: 'assets/site.js',
  format: 'iife',
  target: ['es2018'],
  minify: false,
  sourcemap: true,
});

console.log('Bundled assets/site.js from assets/site/entry.js');
