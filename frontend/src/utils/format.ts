// Small pure functions pulled out of the page components so they're independently
// testable without needing to render a whole React component or a DOM environment.

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatCoverage(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function isPositiveAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0;
}
