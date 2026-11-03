import { describe, expect, it } from 'vitest';
import { formatCurrency } from './utils';

describe('formatCurrency edge cases', () => {
  it('định dạng giá 0 VND không chứa giá trị âm', () => {
    expect(formatCurrency(0)).toMatch(/0/);
    expect(formatCurrency(0)).not.toContain('-');
  });
});
