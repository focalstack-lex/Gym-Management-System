import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('.', import.meta.url));
const DASHES = /[\u2013\u2014]/;
const EMOJI = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20E3]/u;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css|html|json|md)$/.test(name) ? [path] : [];
  });
}

describe('house rules', () => {
  const files = sourceFiles(SRC);

  it('finds source files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('has no en dashes or em dashes', () => {
    const offenders = files.filter((f) => DASHES.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('has no emoji', () => {
    const offenders = files.filter((f) => EMOJI.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
