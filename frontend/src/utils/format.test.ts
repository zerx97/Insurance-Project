import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCoverage, isPositiveAmount } from './format';

describe('formatCurrency', () => {
  it('formats a whole number premium with two decimal places', () => {
    expect(formatCurrency(40)).toBe('$40.00');
  });

  it('formats a value that already has cents', () => {
    expect(formatCurrency(499.5)).toBe('$499.50');
  });
});

describe('formatCoverage', () => {
  it('adds thousands separators for large coverage amounts', () => {
    expect(formatCoverage(300000)).toBe('$300,000');
  });

  it('handles small coverage amounts without separators', () => {
    expect(formatCoverage(500)).toBe('$500');
  });
});

describe('isPositiveAmount', () => {
  it('accepts a normal positive claim amount', () => {
    expect(isPositiveAmount(1500)).toBe(true);
  });

  it('rejects zero and negative amounts', () => {
    expect(isPositiveAmount(0)).toBe(false);
    expect(isPositiveAmount(-10)).toBe(false);
  });

  it('rejects NaN', () => {
    expect(isPositiveAmount(NaN)).toBe(false);
  });
});
