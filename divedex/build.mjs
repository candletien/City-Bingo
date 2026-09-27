// Wraps divedex.html (artifact-style body content) into a standalone page
// served by Next from public/divedex/index.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync(new URL('./divedex.html', import.meta.url), 'utf8');
const [head, ...rest] = src.split('<div class="app">');
const page = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head.trim()}
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
<div class="app">${rest.join('<div class="app">')}</body>
</html>
`;
mkdirSync(new URL('../public/divedex/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/divedex/index.html', import.meta.url), page);
console.log('wrote public/divedex/index.html');
