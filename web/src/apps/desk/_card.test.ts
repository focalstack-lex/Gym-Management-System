import { describe, expect, it } from 'vitest';
import { cardCandidates, cardUid, findMemberByCard } from './_card';
import { SEED_CARDS, SEED_MEMBERS } from '../../demo/seed';

const members = SEED_MEMBERS.map((m) => ({ ...m }));

describe('card reader', () => {
  it('normalizes 8 and 14 character hex UIDs', () => {
    expect(cardUid('04A1B2C3')).toBe('04A1B2C3');
    expect(cardUid('04:a1:b2:c3')).toBe('04A1B2C3');
    expect(cardUid('04A1-B2C3-D4E5-F6')).toBe('04A1B2C3D4E5F6');
  });

  it('normalizes decimal readings to hex', () => {
    expect(cardUid('1234567890')).toBe('499602D2');
    expect(cardUid('0012345678')).toBe('00BC614E');
    expect(cardUid('77705923')).toBe('77705923');
  });

  it('keeps both readings when an 8 digit value is ambiguous', () => {
    expect(cardCandidates('77705923')).toEqual(['77705923', '04A1B2C3']);
  });

  it('rejects values that cannot be a card UID', () => {
    expect(cardUid('not-a-card')).toBeNull();
    expect(cardUid('123')).toBeNull();
    expect(cardUid('18446744073709551615')).toBeNull();
    expect(cardCandidates('')).toEqual([]);
  });

  it('resolves a seeded card by hex or decimal reading', () => {
    expect(findMemberByCard(members, SEED_CARDS, '04A1B2C3')?.member.id).toBe('mika');
    expect(findMemberByCard(members, SEED_CARDS, '77705923')?.member.id).toBe('mika');
    expect(findMemberByCard(members, SEED_CARDS, '78824404')?.member.id).toBe('paolo');
    expect(findMemberByCard(members, SEED_CARDS, 'FFFFFFFF')).toBeNull();
  });
});
