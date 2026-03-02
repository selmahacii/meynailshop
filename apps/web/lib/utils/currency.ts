export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted} DA`;
}

export function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
}
