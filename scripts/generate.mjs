import { readFile, writeFile, readdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const fragments = ['sprites', 'header', 'hero', 'how', 'pains', 'demo', 'occasions', 'peak', 'revenue', 'form', 'faq', 'footer'];
const head = `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Goulash.tech Pets — доставка из зоомагазинов</title>
<meta name="description" content="Заказы, сборка, доставка и повторные покупки для зоомагазинов. Попробуйте интерактивный кабинет Goulash.tech Pets.">
<meta name="theme-color" content="#222222"><link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./css/styles.css"></head><body>
`;
const html = head + (await Promise.all(fragments.map(name => read(`frags/${name}.html`)))).join('\n') + '\n<script type="module" src="./js/app.js"></script>\n</body></html>\n';
const cssFiles = (await readdir(new URL('css_frags/', root))).filter(name => name.endsWith('.css')).sort();
const css = await read('css/base.css') + '\n/* ===== PETS CUSTOMIZATIONS ===== */\n' + (await Promise.all(cssFiles.map(name => read(`css_frags/${name}`)))).join('\n');
await writeFile(new URL('index.html', root), html);
await writeFile(new URL('css/styles.css', root), css);
console.log('Generated Pets page and styles.');
