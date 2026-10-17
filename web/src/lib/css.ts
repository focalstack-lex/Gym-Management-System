// Inline styles are ported verbatim from the design canvas (design/canvas/*.dc.html).
// css() turns a CSS declaration string into a React style object so the original
// string can be pasted unchanged; design-parity.test.ts checks those strings.

import type { CSSProperties } from 'react';

const cache = new Map<string, CSSProperties>();

function toCamel(property: string): string {
  if (property.startsWith('--')) return property;
  const vendor = property.startsWith('-');
  const parts = (vendor ? property.slice(1) : property).split('-');
  const camel = parts.map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('');
  return vendor ? camel.charAt(0).toUpperCase() + camel.slice(1) : camel;
}

// Splits on semicolons that are not inside parentheses or quotes (url(), rgba(), fonts).
function declarations(source: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
    } else if (ch === ';' && depth === 0) {
      out.push(source.slice(start, i));
      start = i + 1;
    }
  }
  out.push(source.slice(start));
  return out.map((d) => d.trim()).filter(Boolean);
}

export function css(source: string): CSSProperties {
  const hit = cache.get(source);
  if (hit) return hit;
  const style: Record<string, string> = {};
  for (const decl of declarations(source)) {
    const colon = decl.indexOf(':');
    if (colon === -1) throw new Error(`Invalid style declaration: ${decl}`);
    style[toCamel(decl.slice(0, colon).trim())] = decl.slice(colon + 1).trim();
  }
  const result = style as CSSProperties;
  cache.set(source, result);
  return result;
}
