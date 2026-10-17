// Guards "do not change any detail of the design": for every canvas artboard, each inline
// style string, each SVG path and each piece of visible copy must appear verbatim in the
// source files that implement it (design-map.ts). Only the phone frame (390 x 844 root)
// is exempt; PhoneScreen replaces it with the real viewport.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DESIGN_MAP, NOT_SCREENS } from './design-map';
import { PARITY_ALLOW } from './design-parity.allow';

const SRC = fileURLToPath(new URL('.', import.meta.url));
const CANVAS = join(SRC, '..', '..', 'design', 'canvas');

const HOLE = '§';
const norm = (s: string) =>
  s
    .replace(/\{\{[^}]*\}\}/g, HOLE)
    .replace(/\$\{[^}]*\}/g, HOLE)
    .replace(/\s+/g, ' ')
    .replace(/;\s*$/, '')
    .trim();

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function canvasBody(file: string): string {
  const html = readFileSync(join(CANVAS, file), 'utf8');
  const body = html.slice(html.indexOf('<x-dc>'), html.indexOf('</x-dc>'));
  return body.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
}

function styles(body: string): string[] {
  return [...body.matchAll(/\sstyle="([^"]*)"/g)]
    .map((m) => norm(decode(m[1])))
    .filter((s) => s && !s.includes('width: 390px; height: 844px'));
}

function paths(body: string): string[] {
  return [...body.matchAll(/\sd="([^"{]*)"/g)].map((m) => m[1]);
}

function copy(body: string): string[] {
  const text = body.replace(/<[^>]+>/g, '\n');
  return text
    .split(/\n|\{\{[^}]*\}\}/)
    .map((t) => decode(t).replace(/\s+/g, ' ').trim())
    .filter((t) => t.length >= 4 && /[A-Za-z]/.test(t));
}

function sourceText(files: string[]): { raw: string; styleStrings: Set<string> } {
  // Seed data is shared by every screen, so its literals count as present.
  const raw = [...files, 'demo/seed.ts', 'components/TabBar.tsx'].map((f) => readFileSync(join(SRC, f), 'utf8')).join('\n');
  const styleStrings = new Set<string>();
  for (const m of raw.matchAll(/css\(\s*(['"`])([\s\S]*?)\1\s*\)/g)) styleStrings.add(norm(m[2]));
  return { raw, styleStrings };
}

describe('design parity', () => {
  const artboards = readdirSync(CANVAS).filter((f) => f.endsWith('.dc.html'));

  it('maps every canvas artboard', () => {
    const unmapped = artboards.filter((f) => !(f in DESIGN_MAP) && !NOT_SCREENS.includes(f));
    expect(unmapped).toEqual([]);
  });

  for (const [artboard, files] of Object.entries(DESIGN_MAP)) {
    describe(artboard, () => {
      const missingFiles = files.filter((f) => !existsSync(join(SRC, f)));

      it('has its implementation files', () => {
        expect(missingFiles).toEqual([]);
      });
      if (missingFiles.length) return;

      const body = canvasBody(artboard);
      const src = sourceText(files);
      const flatRaw = src.raw.replace(/\s+/g, ' ');

      it('keeps every inline style verbatim', () => {
        // A hole on either side (canvas {{value}} or source ${value}) matches one declaration value.
        const toRegex = (s: string) =>
          new RegExp('^' + s.split(HOLE).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^;]+') + '$');
        const sourceList = [...src.styleStrings];
        const sourcePatterns = sourceList.filter((t) => t.includes(HOLE)).map(toRegex);
        const matches = (s: string) =>
          src.styleStrings.has(s) ||
          (s.includes(HOLE) && sourceList.some((t) => toRegex(s).test(t))) ||
          sourcePatterns.some((re) => re.test(s));
        expect(styles(body).filter((s) => !matches(s))).toEqual([]);
      });

      it('keeps every SVG path verbatim', () => {
        expect(paths(body).filter((p) => !src.raw.includes(p))).toEqual([]);
      });

      it('keeps every piece of visible copy verbatim', () => {
        const allowed = new Set(PARITY_ALLOW[artboard] ?? []);
        expect(copy(body).filter((t) => !flatRaw.includes(t) && !allowed.has(t))).toEqual([]);
      });
    });
  }
});
