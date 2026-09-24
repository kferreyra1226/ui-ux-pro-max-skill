/**
 * Post-processes `next build` static export output so it can be hosted anywhere,
 * including on hosts that reserve paths beginning with an underscore.
 *
 * Next.js writes every build asset under `out/_next/`. This script renames that directory
 * to `out/assets/` and rewrites the references to it in the exported HTML, JS, CSS and
 * RSC payload files. Nothing about the application changes; only the asset path does.
 *
 * It also drops Next's legacy polyfill chunk. That chunk is referenced with `noModule`,
 * so only browsers without ES module support ever request it, and no such browser can run
 * this site anyway. It is removed because it embeds literal U+FFFD replacement characters
 * that some static hosts reject. A real deployment keeps it.
 *
 * Run automatically by `npm run build:preview`.
 */
import { readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const OUT = new URL('../out/', import.meta.url).pathname;
const FROM_DIR = join(OUT, '_next');
const TO_DIR = join(OUT, 'assets');
const REWRITE_EXTENSIONS = new Set(['.html', '.js', '.css', '.txt', '.json']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

if (!existsSync(OUT)) {
  console.error('No out/ directory. Run `next build` first.');
  process.exit(1);
}

if (existsSync(FROM_DIR)) {
  await rename(FROM_DIR, TO_DIR);
}

// Drop the legacy `noModule` polyfill chunk and every reference to it.
const polyfills = (await walk(OUT)).filter((f) => /\/polyfills-[^/]+\.js$/.test(f));
const polyfillNames = polyfills.map((f) => f.slice(OUT.length));

for (const file of polyfills) {
  await rm(file);
}

const files = await walk(OUT);
let rewritten = 0;

for (const file of files) {
  if (!REWRITE_EXTENSIONS.has(extname(file))) continue;
  const original = await readFile(file, 'utf8');
  // Covers "/_next/..." in markup and "/_next/" as the webpack public path.
  let updated = original.split('/_next/').join('/assets/');
  for (const name of polyfillNames) {
    const asset = name.replace(/^_next\//, 'assets/');
    updated = updated
      .replace(new RegExp(`<script src="/${asset}"[^>]*></script>`, 'g'), '')
      .replace(new RegExp(`<script src="/${asset}"[^>]*/?>`, 'g'), '');
  }
  if (updated !== original) {
    await writeFile(file, updated, 'utf8');
    rewritten += 1;
  }
}

const remaining = [];
for (const file of files) {
  if (!REWRITE_EXTENSIONS.has(extname(file))) continue;
  if ((await readFile(file, 'utf8')).includes('/_next/')) remaining.push(file);
}

const total = (await walk(OUT)).length;
console.log(
  `Removed ${polyfillNames.length} legacy polyfill chunk(s). ` +
  `Rewrote ${rewritten} file(s). ${total} file(s) in out/.`,
);

if (remaining.length > 0) {
  console.error('Still referencing /_next/:', remaining);
  process.exit(1);
}

const underscored = (await walk(OUT))
  .map((f) => f.slice(OUT.length))
  .filter((p) => p.startsWith('_'));

if (underscored.length > 0) {
  console.error('Paths still start with an underscore:', underscored);
  process.exit(1);
}

console.log('Static preview output is ready.');
