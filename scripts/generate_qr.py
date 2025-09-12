#!/usr/bin/env python3
import argparse
import csv
import os
from pathlib import Path

import qrcode


def build_payload(qr_id: str, fitting_id: str, mode: str, base_url: str | None) -> str:
    if mode == 'url':
        if not base_url:
            raise SystemExit('When mode=url, provide --base https://your-domain/qr')
        return f"{base_url}?id={qr_id}"
    if mode == 'json':
        import json
        return json.dumps({'qr_id': qr_id, 'fitting_id': fitting_id})
    return qr_id


def main():
    ap = argparse.ArgumentParser(description='Generate QR PNGs from CSV with qr_code__qr_id')
    ap.add_argument('--in', dest='input', required=True, help='Path to CSV (Dataset/track_fittings_dataset.csv)')
    ap.add_argument('--out', dest='out', default='qr-out', help='Output directory')
    ap.add_argument('--mode', dest='mode', default='url', choices=['url', 'id', 'json'])
    ap.add_argument('--base', dest='base', default=os.getenv('QR_BASE_URL'))
    args = ap.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    with open(args.input, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('fitting_id') or not row.get('qr_code__qr_id'):
                continue
            qr_id = row['qr_code__qr_id']
            payload = build_payload(qr_id, row['fitting_id'], args.mode, args.base)
            img = qrcode.make(payload)
            img.save(out_dir / f"{qr_id}.png")
            count += 1

    print(f"Generated {count} QR PNGs in {out_dir}")


if __name__ == '__main__':
    main()


