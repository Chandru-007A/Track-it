#!/usr/bin/env -S node --loader tsx
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

type Args = {
  input: string;
  outDir: string;
  payload: 'url' | 'id' | 'json';
  baseUrl?: string; // required when payload=url
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  let input = '';
  let outDir = './qr-out';
  let payload: Args['payload'] = 'url';
  let baseUrl: string | undefined = process.env.QR_BASE_URL;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--in' || a === '--input') input = argv[++i];
    else if (a === '--out' || a === '--outDir') outDir = argv[++i];
    else if (a === '--payload') payload = argv[++i] as Args['payload'];
    else if (a === '--base' || a === '--baseUrl') baseUrl = argv[++i];
  }

  if (!input) {
    console.error('Usage: tsx scripts/generate-qr.ts --in <csv> [--out ./qr-out] [--payload url|id|json] [--base https://your-domain/qr]');
    process.exit(1);
  }
  if (payload === 'url' && !baseUrl) {
    console.error('When --payload url is used, provide --base https://your-domain/qr or set QR_BASE_URL env var');
    process.exit(1);
  }
  return { input, outDir, payload, baseUrl };
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  const { input, outDir, payload, baseUrl } = parseArgs();
  const csv = fs.readFileSync(input, 'utf8');
  const rows: any[] = parse(csv, { columns: true, skip_empty_lines: true });

  ensureDir(outDir);

  // The dataset has continuation rows (empty fitting_id). Filter for primary rows with qr_code__qr_id
  const primaries = rows.filter(r => r['fitting_id'] && r['qr_code__qr_id']);

  let count = 0;
  for (const row of primaries) {
    const qrId: string = row['qr_code__qr_id'];
    let text = '';
    if (payload === 'url') text = `${baseUrl!.replace(/\/$/, '')}?id=${encodeURIComponent(qrId)}`;
    else if (payload === 'id') text = qrId;
    else text = JSON.stringify({ qr_id: qrId, fitting_id: row['fitting_id'] });

    const filename = path.join(outDir, `${qrId}.png`);
    await QRCode.toFile(filename, text, {
      type: 'png',
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 1024,
      color: { dark: '#000000', light: '#FFFFFFFF' },
    });
    count++;
  }
  console.log(`Generated ${count} QR PNGs in ${outDir}`);
}

main().catch((e) => { console.error(e); process.exit(1); });


