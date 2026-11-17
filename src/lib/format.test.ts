import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('đổi ngày ISO sang dd/mm/yyyy', () => {
    expect(formatDate('2026-12-02')).toBe('02/12/2026');
  });
});
