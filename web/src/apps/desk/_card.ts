// Keyboard-wedge NFC card reader support for the front desk.
//
// The 13.56 MHz USB Mifare readers sold for access control enumerate as keyboards: tapping a
// card types its UID and presses Enter. This module normalizes the typed value, resolves it to
// a member, and captures the keystrokes only on screens that opt in (the desk Scan screen).
// Production replaces the demo registry with a member_cards table and a server-side RPC.

import { useEffect, useRef } from 'react';
import type { Member } from '../../demo/seed';
import { SEED_CARDS } from '../../demo/seed';

const STORAGE_KEY = 'infinity.cards.v1';
const KEY_GAP_MS = 250;
const MAX_BUFFER = 32;

const clean = (raw: string) => raw.replace(/[\s:.-]/g, '').toUpperCase().replace(/^0X/, '');

function decimalToUid(digits: string): string | null {
  try {
    const value = BigInt(digits);
    const hex = value.toString(16).toUpperCase();
    if (hex.length <= 8) return hex.padStart(8, '0');
    if (hex.length <= 14) return hex.padStart(14, '0');
    return null;
  } catch {
    return null;
  }
}

// The canonical UID for the reader's most common formats: 8 or 14 hex characters, or a decimal
// rendering of a 4-byte or 7-byte UID.
export function cardUid(raw: string): string | null {
  const value = clean(raw);
  if (/^[0-9A-F]{8}$/.test(value) || /^[0-9A-F]{14}$/.test(value)) return value;
  if (/^\d{8,20}$/.test(value)) return decimalToUid(value);
  return null;
}

// Some readers print decimal while the registry uses hex. Return every plausible reading so
// lookup succeeds without asking the desk to reconfigure the reader.
export function cardCandidates(raw: string): string[] {
  const value = clean(raw);
  if (!value) return [];
  const out: string[] = [];
  const canonical = cardUid(value);
  if (canonical) out.push(canonical);
  if (/^\d{8,20}$/.test(value)) {
    const fromDecimal = decimalToUid(value);
    if (fromDecimal && !out.includes(fromDecimal)) out.push(fromDecimal);
  }
  return out;
}

// The value shown to staff when a card is not assigned yet.
export function preferredCard(raw: string): string | null {
  return cardUid(raw);
}

export function loadCardMap(): Record<string, string> {
  const seed = { ...SEED_CARDS };
  if (typeof window === 'undefined') return seed;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as unknown;
    if (!stored || typeof stored !== 'object') return seed;
    const extra: Record<string, string> = {};
    for (const [uid, memberId] of Object.entries(stored)) {
      if (typeof memberId === 'string' && /^[0-9A-F]{8}$|^[0-9A-F]{14}$/.test(uid)) extra[uid] = memberId;
    }
    return { ...seed, ...extra };
  } catch (error) {
    console.error('Could not read the local card registry', error);
    return seed;
  }
}

export function assignCard(uid: string, memberId: string): Record<string, string> {
  const next = { ...loadCardMap(), [uid]: memberId };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Could not save the local card registry', error);
  }
  return next;
}

export function findMemberByCard(
  members: readonly Member[],
  cards: Record<string, string>,
  raw: string,
): { member: Member; uid: string } | null {
  for (const uid of cardCandidates(raw)) {
    const memberId = cards[uid];
    if (!memberId) continue;
    const member = members.find((m) => m.id === memberId);
    if (member) return { member, uid };
  }
  return null;
}

// Listen for a keyboard-wedge read. Only attach on screens where no text input is in use.
export function useCardReader(onCard: (raw: string) => void, enabled = true): void {
  const callback = useRef(onCard);
  useEffect(() => {
    callback.current = onCard;
  }, [onCard]);

  useEffect(() => {
    if (!enabled) return;
    let buffer = '';
    let last = 0;
    let idle: number | undefined;

    const emit = () => {
      const raw = buffer;
      buffer = '';
      if (raw.length >= 8) callback.current(raw);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) return;

      const now = performance.now();
      if (now - last > KEY_GAP_MS) buffer = '';
      last = now;

      if (event.key === 'Enter' || event.key === 'Tab') {
        if (idle) window.clearTimeout(idle);
        const raw = buffer;
        buffer = '';
        if (raw.length < 8) return;
        event.preventDefault();
        event.stopPropagation();
        callback.current(raw);
        return;
      }

      if (event.key.length === 1 && /^[0-9A-Za-z]$/.test(event.key)) {
        buffer = (buffer + event.key).slice(-MAX_BUFFER);
        // Readers with a suffix press Enter and are handled above. This idle flush covers
        // readers configured without one.
        if (idle) window.clearTimeout(idle);
        idle = window.setTimeout(emit, 180);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      if (idle) window.clearTimeout(idle);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [enabled]);
}
