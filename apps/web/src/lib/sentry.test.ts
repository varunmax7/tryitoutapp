import { describe, expect, it } from 'vitest';
import { redactUrl } from './sentry';

/**
 * Privacy guard: vote tokens, purchase ids and pasted product links must never reach an
 * error report (implementation.md §15 Phase 0 task 8, AGENTS.md rule 2).
 */
describe('redactUrl', () => {
  it('drops the query string that carries shared product links', () => {
    expect(redactUrl('https://tryitout.pages.dev/check?url=https://myntra.com/x/123/buy')).toBe(
      'https://tryitout.pages.dev/check',
    );
  });

  it('drops the fragment', () => {
    expect(redactUrl('https://tryitout.pages.dev/sizes#zara')).toBe(
      'https://tryitout.pages.dev/sizes',
    );
  });

  it('redacts a vote token', () => {
    expect(redactUrl('https://tryitout.pages.dev/v/Hk3nR7xQp2LmV8sTd1Zc')).toBe(
      'https://tryitout.pages.dev/v/:id',
    );
  });

  it('redacts a uuid purchase id', () => {
    expect(redactUrl('/did-it-fit/2b5a9f10-1c3e-4b7a-9d21-8f6c4e0a7b11')).toBe('/did-it-fit/:id');
  });

  it('keeps readable route names', () => {
    expect(redactUrl('/sizes/zara/tshirt')).toBe('/sizes/zara/tshirt');
  });

  it('never throws on a malformed url', () => {
    expect(redactUrl('http://[')).toBe('[redacted]');
  });
});
