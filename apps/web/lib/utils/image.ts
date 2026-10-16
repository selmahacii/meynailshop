export function formatImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '/images/placeholder-product.png';
  }

  const trimmed = url.trim();

  // If already an absolute http/https URL, return it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If relative path without leading slash, e.g. "uploads/xyz.webp"
  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }

  // If starts with /uploads/
  if (trimmed.startsWith('/uploads/')) {
    return trimmed;
  }

  // If it's a raw filename like "xyz.webp"
  if (trimmed.endsWith('.webp') || trimmed.endsWith('.png') || trimmed.endsWith('.jpg') || trimmed.endsWith('.jpeg')) {
    return `/uploads/${trimmed}`;
  }

  return trimmed;
}
