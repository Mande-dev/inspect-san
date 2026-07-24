import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const files = [
  'dist/index.html',
  'dist/pages/blank.html',
  'dist/pages/error/maintenance.html',
  'dist/pages/error/404-error.html',
  'dist/pages/authentication/sign-up.html',
  'dist/pages/authentication/sign-in.html',
  'dist/pages/authentication/reset-password.html',
  'dist/pages/authentication/otp-varification.html',
  'dist/pages/authentication/forget-password.html',
];

const nested =
  /<!DOCTYPE html>\s*<html lang="en">\s*<head>\s*<meta charset="UTF-8">\s*<meta name="viewport" content="width=device-width, initial-scale=1.0">\s*<\/head>\s*<body>\s*<p class="text-center">© All rights reserved by <a href="https:\/\/codescandy\.com" target="_blank">CodesCandy<\/a>\. Distributed by <a href="https:\/\/themewagon\.com" target="_blank">ThemeWagon<\/a>\.<\/p>\s*<\/body>\s*<\/html>/;

const replacement =
  '<p class="text-center">© All rights reserved by <a href="https://codescandy.com" target="_blank" rel="noopener noreferrer">CodesCandy</a>. Distributed by <a href="https://themewagon.com" target="_blank" rel="noopener noreferrer">ThemeWagon</a>.</p>';

for (const f of files) {
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  if (!nested.test(html)) {
    console.log('NO MATCH:', f);
    continue;
  }
  html = html.replace(nested, replacement);
  html = html.replace(/target="_blank"(?![^>]*\brel=)/g, 'target="_blank" rel="noopener noreferrer"');
  fs.writeFileSync(p, html);
  console.log('FIXED:', f);
}
