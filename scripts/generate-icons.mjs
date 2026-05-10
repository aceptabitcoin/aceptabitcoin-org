// scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_PATH = join(__dirname, '../public/icons/icon.svg');
const OUT_DIR = join(__dirname, '../public/icons');

const sizes = [
  { name: 'icon-192x192.png', width: 192, height: 192 },
  { name: 'icon-512x512.png', width: 512, height: 512 },
  { name: 'apple-touch-icon.png', width: 180, height: 180 },
  { name: 'maskable-icon-512x512.png', width: 512, height: 512 }, // Android adaptive
];

async function generate() {
  await mkdir(OUT_DIR, { recursive: true });
  
  for (const size of sizes) {
    const outPath = join(OUT_DIR, size.name);
    await sharp(SVG_PATH)
      .resize(size.width, size.height)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outPath);
    console.log(`✅ ${size.name} generado`);
  }
  console.log(' Iconos listos para PWA');
}

generate().catch(console.error);