import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const required = ['index.html', 'styles.css', 'catalog.css', 'catalog.js', 'catalog-copy.js', 'publishing-copy.js', 'script.js', 'privacy-policy.txt', 'data/projects.json', 'data/reviews.json', 'data/ratings.json'];
const vendors = ['fuse.js', 'lucide.min.js'];
const files = [...required];
function collect(directory) {
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const name = `${directory}/${entry.name}`;
    assert(!entry.isSymbolicLink(), `Symlink is not allowed: ${name}`);
    if (entry.isDirectory()) collect(name);
    else {
      assert(/\.(png|jpe?g|gif|webp|ico|txt)$/i.test(name) || (directory === 'assets/vendor' && vendors.includes(entry.name)), `Unapproved asset: ${name}`);
      files.push(name);
    }
  }
}
collect('assets');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'data/projects.json'), 'utf8'));
const ids = new Set();
for (const p of projects) {
  assert(p.id && !ids.has(p.id), 'Project IDs must be present and unique');
  ids.add(p.id);
  assert(['published', 'draft', 'soon'].includes(p.status), `Invalid status: ${p.id}`);
  if (p.status !== 'published') continue;
  assert(p.title && p.description && p.screenshot && p.categories?.length, `Incomplete project: ${p.id}`);
  assert(!p.licenseType || ['free', 'freemium', 'paid'].includes(p.licenseType), `Invalid license type: ${p.id}`);
  assert(p.price === null || p.price === undefined || (Number.isFinite(p.price.amount) && p.price.amount >= 0 && /^[A-Z]{3}$/.test(p.price.currency)), `Invalid price: ${p.id}`);
  if (p.downloadAvailable !== false) {
    assert(p.downloadUrl || p.storeUrl, `Missing download: ${p.id}`);
    assert(!/\/archive\/refs\//.test(p.downloadUrl || ''), `Source archive is not a download: ${p.id}`);
  }
  for (const field of ['downloadUrl', 'storeUrl', 'portablePreviewUrl', 'videoUrl', 'githubUrl']) {
    if (p[field]) assert(new URL(p[field]).protocol === 'https:', `Expected HTTPS: ${p.id}.${field}`);
  }
  for (const asset of [p.screenshot, p.qrImage, ...(p.gallery || []).map(i => i.src || i)].filter(Boolean)) {
    assert(files.includes(asset), `Missing local asset: ${asset}`);
  }
}
assert(projects.some(p => p.status === 'published'), 'Catalog is empty');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'catalog-copy.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root, 'publishing-copy.js'), 'utf8'), context);
for (const language of ['ru', 'en', 'de']) {
  for (const p of projects.filter(p => p.status === 'published')) {
    const copy = context.window.CodeWerkCatalogCopy[language].projects[p.id];
    assert(copy?.tagline && copy.description, `Missing ${language} translation: ${p.id}`);
  }
}
for (const name of files) {
  const source = path.join(root, name);
  assert(!fs.lstatSync(source).isSymbolicLink(), `Symlink is not allowed: ${name}`);
  if (/\.(js|json|html|css|txt)$/.test(name)) {
    const text = fs.readFileSync(source, 'utf8');
    assert(!/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AIza[0-9A-Za-z_-]{35}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(text), `Possible secret in ${name}`);
    assert(!/(?:https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?|C:\\\\Users\\\\)/i.test(text), `Local reference in ${name}`);
    if (name.endsWith('.js')) new vm.Script(text, { filename: name });
    if (name.endsWith('.json')) JSON.parse(text);
  }
}
// Delete only the fixed, generated output under this repository, never a computed user path.
assert(path.dirname(output) === root && path.basename(output) === 'dist');
assert(!fs.existsSync(output) || !fs.lstatSync(output).isSymbolicLink(), 'Output cannot be a symlink');
fs.rmSync(output, { recursive: true, force: true });
for (const name of files) {
  const target = path.join(output, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (name === 'data/projects.json') fs.writeFileSync(target, JSON.stringify(projects.filter(p => p.status === 'published'), null, 2) + '\n');
  else fs.copyFileSync(path.join(root, name), target);
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
fs.writeFileSync(path.join(output, 'build.json'), JSON.stringify({ commit: process.env.GITHUB_SHA || null, files: files.length, projects: projects.filter(p => p.status === 'published').length }) + '\n');
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
for (const [, url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(https?:|mailto:)/.test(url)) continue;
  assert(!url.startsWith('/'), `Root-relative URL breaks project Pages: ${url}`);
  assert(fs.existsSync(path.join(output, url.split(/[?#]/)[0])), `Missing HTML resource: ${url}`);
}
console.log(`Production ready: ${files.length} approved files, ${projects.filter(p => p.status === 'published').length} programs; JSON, JavaScript, translations, local paths and secret-pattern checks passed.`);
