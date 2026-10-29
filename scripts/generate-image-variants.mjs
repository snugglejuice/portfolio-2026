// Generates smaller copies of the large project / about images so next/image
// can serve a responsive srcset on the static export (GitHub Pages has no
// image optimizer). Run after adding or replacing an image:
//
//   node scripts/generate-image-variants.mjs
//
// Needs ImageMagick (`magick`) on the PATH. Writes the files to
// public/img-variants/ and the list of available widths to
// lib/imageVariants.json, which lib/imageLoader.ts reads. Images missing from
// that list are simply served as-is.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'img-variants');
const MANIFEST = path.join(ROOT, 'lib/imageVariants.json');
const SOURCE_DIRS = ['work', 'about'];
// Keep in sync with images.deviceSizes in next.config.ts: 560 / 750 cover
// the in-card images on phones (~1.75-2.5x), 1200 retina phones and small
// laptops; bigger screens get the original.
const WIDTHS = [560, 750, 1200];
const QUALITY = 80;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const manifest = {};
for (const file of SOURCE_DIRS.flatMap((dir) => walk(path.join(PUBLIC, dir)))) {
  if (!file.endsWith('.webp')) continue;
  const src = '/' + path.relative(PUBLIC, file).split(path.sep).join('/');
  const originalWidth = Number(
    execFileSync('magick', ['identify', '-format', '%w', file]).toString(),
  );
  const widths = WIDTHS.filter((width) => width < originalWidth);
  if (!widths.length) continue;

  for (const width of widths) {
    const target = path.join(OUT, src.replace(/\.webp$/, `-${width}w.webp`));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (
      fs.existsSync(target) &&
      fs.statSync(target).mtimeMs > fs.statSync(file).mtimeMs
    )
      continue;
    execFileSync('magick', [
      file,
      '-resize',
      `${width}x`,
      '-strip',
      '-quality',
      String(QUALITY),
      target,
    ]);
  }
  manifest[src] = widths;
}

// One entry per line (Prettier's own JSON style).
const entries = Object.entries(manifest).map(
  ([src, widths]) => `  ${JSON.stringify(src)}: [${widths.join(', ')}]`,
);
fs.writeFileSync(MANIFEST, `{\n${entries.join(',\n')}\n}\n`);
console.log(
  `${Object.keys(manifest).length} images → ${path.relative(ROOT, OUT)}`,
);
